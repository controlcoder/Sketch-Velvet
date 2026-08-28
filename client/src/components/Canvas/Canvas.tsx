import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { renderScene } from "./Renderer";
import { panCamera, zoomCamera } from "./Camera";
import type { Camera, CanvasElement, ResizeHandle, Tool } from "./types";
import { useHistory } from "../../hooks/useHistory";
import { useCanvasSize } from "../../hooks/useCanvaSize";
import { useKeyboardShortcuts } from "../../hooks/useKeyboardShortcuts";
import { hitTest } from "../../editing/selection/hitTest";
import TextEditor from "../TextEditor/TextEditor";
import Toolbar from "../Toolbar/Toolbar";
import HistoryPanel from "../HistoryPanel/HistoryPanel";
import { createElement } from "../../tools/createElement";
import { updateCursor } from "../../editing/selection/updateCursor";
import { updateDrawingElement } from "../../tools/updateDrawingElement";
import { isLineElement, isPencilElement } from "../../utils/elementHelpers";
import { useRenderLoop } from "../../hooks/useRenderLoop";
import ZoomControls from "../ZoomControls/ZoomControls";
import { useZoomControls } from "../../hooks/useZoomControls";
import { getHandleAtPosition } from "../../editing/selection/getHandleAtPosition";
import { resizeElement } from "../../editing/resize/resizeElement";
import { useDeleteShortcut } from "../../hooks/useDeleteShortcut";
import { Navigate } from "react-router-dom";
import { useAutosave } from "../../hooks/useAutosave";
import { useSavedElements } from "../../hooks/useSavedElements";
import { socket } from "../../config/socket";

export default function Canvas({ boardId }: { boardId: string | undefined }) {
  if (!boardId) {
    return <Navigate to="/dashboard" replace />;
  }

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const isDirtyRef = useRef(false);

  const [camera, setCamera] = useState<Camera>({
    x: 0,
    y: 0,
    zoom: 1,
  });

  const [strokeColor, setStrokeColor] = useState("#000000");

  const [tool, setTool] = useState<Tool>("select");

  const [elements, setElements] = useState<CanvasElement[]>([]);

  const [drawingElement, setDrawingElement] = useState<CanvasElement | null>(
    null,
  );

  const [resizingElementId, setResizingElementId] = useState<string | null>(
    null,
  );

  const resizeHandle = useRef<ResizeHandle | null>(null);

  const { isViewer } = useSavedElements({
    boardId,
    setElements,
    setCamera,
  });

  const {
    undo,
    redo,
    canUndo,
    canRedo,
    setElementsWithHistory,
    commitHistory,
  } = useHistory(setElements);

  const { setZoomIn, setZoomOut, resetZoom } = useZoomControls(setCamera, isDirtyRef);

  const isPanning = useRef(false);

  const lastMouse = useRef({
    x: 0,
    y: 0,
  });

  const [textEditor, setTextEditor] = useState<{
    x: number;
    y: number;
    value: string;
  } | null>(null);

  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null,
  );

  const selectedElement = useMemo(
    () => elements.find((element) => element.id === selectedElementId) ?? null,
    [elements, selectedElementId],
  );

  const [movingElementId, setMovingElementId] = useState<string | null>(null);

  const dragOffset = useRef({
    x: 0,
    y: 0,
  });

  const dragStartElementsRef = useRef<CanvasElement[] | null>(null);

  const movedElementsRef = useRef<CanvasElement[] | null>(null);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const renderedElements = drawingElement
      ? [...elements, drawingElement]
      : elements;

    renderScene(
      ctx,
      canvas.width,
      canvas.height,
      renderedElements,
      camera,
      selectedElementId || null,
      drawingElement,
    );
  }, [camera, elements, drawingElement, selectedElementId]);

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();

    return {
      x: (e.clientX - rect.left - camera.x) / camera.zoom,
      y: (e.clientY - rect.top - camera.y) / camera.zoom,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button === 1) {
      isPanning.current = true;

      lastMouse.current = {
        x: e.clientX,
        y: e.clientY,
      };

      return;
    }

    // Viewers can only pan (middle-click above), block everything else
    if (isViewer) return;

    if (textEditor) {
      return;
    }

    const { x, y } = getCanvasCoordinates(e);

    if (tool === "select") {
      if (selectedElement) {
        const handle = getHandleAtPosition(
          selectedElement,
          e.clientX,
          e.clientY,
          camera,
        );

        if (handle) {
          dragStartElementsRef.current = elements;
          resizeHandle.current = handle;
          setResizingElementId(selectedElement.id);
          return;
        }
      }

      const selected = [...elements]
        .reverse()
        .find((element) => hitTest(element, x, y));

      if (!selected) {
        setSelectedElementId(null);
        return;
      }

      setSelectedElementId(selected.id);

      dragStartElementsRef.current = elements;

      setMovingElementId(selected.id);

      if (isLineElement(selected)) {
        dragOffset.current = {
          x: x - selected.start.x,
          y: y - selected.start.y,
        };
      } else if (isPencilElement(selected)) {
        dragOffset.current = {
          x: x - selected.points[0].x,
          y: y - selected.points[0].y,
        };
      } else {
        dragOffset.current = {
          x: x - selected.x,
          y: y - selected.y,
        };
      }

      return;
    }

    if (tool === "text") {
      e.preventDefault();
      setTextEditor({
        x,
        y,
        value: "",
      });

      return;
    }

    const element = createElement(tool, x, y, strokeColor);

    if (element) {
      setDrawingElement(element);
      return;
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    if (isPanning.current) {
      const dx = mouseX - lastMouse.current.x;

      const dy = mouseY - lastMouse.current.y;

      setCamera((prev) => panCamera(prev, dx, dy));

      lastMouse.current = {
        x: mouseX,
        y: mouseY,
      };

      return;
    }

    if (isViewer) {
      e.currentTarget.style.cursor = "default";
      return;
    }

    const { x, y } = getCanvasCoordinates(e);

    if (resizingElementId) {
      setElements((prev) => {
        const next = prev.map((element) =>
          element.id !== resizingElementId
            ? element
            : resizeElement(element, resizeHandle.current!, x, y),
        );

        movedElementsRef.current = next;
        return next;
      });

      return;
    }

    if (movingElementId) {
      setElements((prev) => {
        const next = prev.map((element) => {
          if (element.id !== movingElementId) {
            return element;
          }

          if (isLineElement(element)) {
            const dx = x - dragOffset.current.x - element.start.x;

            const dy = y - dragOffset.current.y - element.start.y;

            return {
              ...element,
              start: {
                x: element.start.x + dx,
                y: element.start.y + dy,
              },
              end: {
                x: element.end.x + dx,
                y: element.end.y + dy,
              },
            };
          }

          if (isPencilElement(element)) {
            const dx = x - dragOffset.current.x - element.points[0].x;

            const dy = y - dragOffset.current.y - element.points[0].y;

            return {
              ...element,
              points: element.points.map((p) => ({
                x: p.x + dx,
                y: p.y + dy,
              })),
            };
          }

          return {
            ...element,
            x: x - dragOffset.current.x,
            y: y - dragOffset.current.y,
          };
        });

        movedElementsRef.current = next;

        return next;
      });

      return;
    }

    if (tool === "select") {
      updateCursor(e.currentTarget, selectedElement, mouseX, mouseY, camera);
    } else {
      e.currentTarget.style.cursor = "crosshair";
    }

    if (!drawingElement) return;

    setDrawingElement(updateDrawingElement(drawingElement, x, y));
  };

  const handleMouseUp = () => {
    isPanning.current = false;

    if (isViewer) return;

    if (resizingElementId) {
      isDirtyRef.current = true;

      if (dragStartElementsRef.current && movedElementsRef.current) {
        commitHistory(dragStartElementsRef.current, movedElementsRef.current);
      }

      resizeHandle.current = null;
      movedElementsRef.current = null;
      dragStartElementsRef.current = null;

      setResizingElementId(null);

      return;
    }

    if (movingElementId) {
      isDirtyRef.current = true;

      if (dragStartElementsRef.current && movedElementsRef.current) {
        commitHistory(dragStartElementsRef.current, movedElementsRef.current);
      }

      dragStartElementsRef.current = null;
      movedElementsRef.current = null;
      setMovingElementId(null);

      return;
    }

    if (drawingElement) {
      setElementsWithHistory((prev) => [...prev, drawingElement]);

      isDirtyRef.current = true;

      socket.emit("element:create", {
        boardId,
        element: drawingElement,
      });

      setDrawingElement(null);
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.stopPropagation();
    isDirtyRef.current = true;
    setCamera((prev) => zoomCamera(prev, e.deltaY));
  };

  useKeyboardShortcuts({
    undo,
    redo,
    setZoomIn,
    setZoomOut,
    resetZoom,
    disabled: isViewer,
  });

  useCanvasSize(canvasRef);

  useRenderLoop(redraw);

  useDeleteShortcut({
    selectedElementId,
    setSelectedElementId,
    setElementsWithHistory,
    disabled: isViewer,
    isDirtyRef,
    boardId
  });

  useAutosave({
    boardId,
    elements,
    camera,
    isViewer,
    isDirtyRef,
  });

  useEffect(() => {
    const handleElementCreate = ({
      element,
    }: {
      element: CanvasElement;
      userId: string;
    }) => {
      setElements((prev) => [...prev, element]);
    };

    const handleElementDelete = ({
      elementId,
    }: {
      elementId: string;
      userId: string;
    }) => {
      setElements((prev) => prev.filter((element) => element.id !== elementId));
    };

    socket.on("element:create", handleElementCreate);
    socket.on("element:delete", handleElementDelete);

    return () => {
      socket.off("element:create", handleElementCreate);
      socket.off("element:delete", handleElementDelete);
    };
  }, []);

  return (
    <>
      {!isViewer && (
        <Toolbar
          tool={tool}
          setTool={setTool}
          strokeColor={strokeColor}
          setStrokeColor={setStrokeColor}
        />
      )}

      {!isViewer && (
        <TextEditor
          textEditor={textEditor}
          setTextEditor={setTextEditor}
          camera={camera}
          strokeColor={strokeColor}
          onSave={(text, x, y) => {
            const textElement: CanvasElement = {
              id: crypto.randomUUID(),
              type: "text",
              x,
              y,
              text,
              fontSize: 20,
              stroke: strokeColor,
            };
            setElementsWithHistory((prev) => [...prev, textElement]);
            setTool("select");
          }}
        />
      )}

      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{
          width: "100vw",
          height: "100vh",
          display: "block",
        }}
        onDoubleClick={() => {
          if (!isViewer) setTool("select");
        }}
      />

      {!isViewer && (
        <HistoryPanel
          undo={undo}
          redo={redo}
          canUndo={canUndo}
          canRedo={canRedo}
        />
      )}

      <ZoomControls
        zoom={camera.zoom}
        onZoomIn={setZoomIn}
        onZoomOut={setZoomOut}
        onReset={resetZoom}
      />

      {isViewer && (
        <div
          style={{
            position: "fixed",
            top: 24,
            left: "50%",
            transform: "translateX(-50%)",
            background: "linear-gradient(135deg, #6965DB 0%, #4F46E5 100%)",
            color: "#fff",
            padding: "8px 24px",
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 600,
            fontFamily:
              '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
            letterSpacing: "0.02em",
            boxShadow: "0 4px 20px rgba(105, 101, 219, 0.35)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            gap: 8,
            userSelect: "none",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          View only
        </div>
      )}
    </>
  );
}
