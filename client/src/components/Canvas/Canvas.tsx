import { useCallback, useEffect, useRef, useState } from "react";
import { renderScene } from "./Renderer";
import { panCamera, zoomCamera } from "./Camera";
import type { Camera, CanvasElement, Tool } from "./types";
import { useHistory } from "../../hooks/useHistory";
import { useCanvasSize } from "../../hooks/useCanvaSize";
import { useKeyboardShortcuts } from "../../hooks/useKeyboardShortcuts";
import { hitTest } from "../../selection/hitTest";
import TextEditor from "../TextEditor/TextEditor";
import Toolbar from "../Toolbar/Toolbar";
import HistoryPanel from "../HistoryPanel/HistoryPanel";
import { createElement } from "../../tools/createElement";
import { updateCursor } from "../../selection/updateCursor";
import { updateDrawingElement } from "../../tools/updateDrawingElement";

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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

  const { undo, redo, canUndo, canRedo, setElementsWithHistory } =
    useHistory(setElements);

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

  const [selectedElement, setSelectedElement] = useState<CanvasElement | null>(
    null,
  );

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
      selectedElement?.id || null,
    );
  }, [camera, elements, drawingElement, selectedElement]);

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

    if (textEditor) {
      return;
    }

    const { x, y } = getCanvasCoordinates(e);

    if (tool === "select") {
      const selected = [...elements]
        .reverse()
        .find((element) => hitTest(element, x, y));
      setSelectedElement(selected || null);

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

    const { x, y } = getCanvasCoordinates(e);

    if (tool === "select") {
      updateCursor(e.currentTarget, selectedElement, mouseX, mouseY, camera);
    }

    if (!drawingElement) return;

    setDrawingElement(updateDrawingElement(drawingElement, x, y));
  };

  const handleMouseUp = () => {
    isPanning.current = false;

    if (drawingElement) {
      setElementsWithHistory((prev) => [...prev, drawingElement]);

      setDrawingElement(null);
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.stopPropagation();
    setCamera((prev) => zoomCamera(prev, e.deltaY));
  };

  useKeyboardShortcuts({ undo, redo });

  useCanvasSize(canvasRef, redraw);

  useEffect(() => {
    let animationId: number;

    const loop = () => {
      redraw();
      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(animationId);
  }, [redraw]);

  return (
    <>
      <Toolbar
        tool={tool}
        setTool={setTool}
        strokeColor={strokeColor}
        setStrokeColor={setStrokeColor}
      />

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
        onDoubleClick={() => setTool("select")}
      />

      <HistoryPanel
        undo={undo}
        redo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
      />
    </>
  );
}
