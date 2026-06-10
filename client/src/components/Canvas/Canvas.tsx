import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { renderScene } from "./Renderer";
import { panCamera, zoomCamera } from "./Camera";

import type {
  Camera,
  CanvasElement,
  Tool,
  RectangleElement,
  CircleElement,
  LineElement,
} from "./types";
import { useHistory } from "../../hooks/useHistory";

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [camera, setCamera] = useState<Camera>({
    x: 0,
    y: 0,
    zoom: 1,
  });

  const [strokeColor, setStrokeColor] = useState("#000000");

  const [tool, setTool] = useState<Tool>("rectangle");

  const [elements, setElements] = useState<CanvasElement[]>([]);

  const [drawingElement, setDrawingElement] = useState<CanvasElement | null>(
    null,
  );

  const { undo, redo, canUndo, canRedo, setElementsWithHistory } = useHistory(
    setElements,
  );

  const isPanning = useRef(false);

  const lastMouse = useRef({
    x: 0,
    y: 0,
  });

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const isEditingText = useRef(false);

  const [textEditor, setTextEditor] = useState<{
    x: number;
    y: number;
    value: string;
  } | null>(null);

  const redraw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const renderedElements = drawingElement
      ? [...elements, drawingElement]
      : elements;

    renderScene(ctx, canvas.width, canvas.height, renderedElements, camera);
  };

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

    if (isEditingText.current) {
      isEditingText.current = false;
      return;
    }

    const { x, y } = getCanvasCoordinates(e);

    if (tool === "rectangle") {
      const rectangle: RectangleElement = {
        id: crypto.randomUUID(),
        type: "rectangle",
        x,
        y,
        width: 0,
        height: 0,
        stroke: strokeColor,
      };

      setDrawingElement(rectangle);

      return;
    }

    if (tool === "text") {
      e.preventDefault();
      isEditingText.current = true;
      setTextEditor({
        x,
        y,
        value: "",
      });

      return;
    }

    if (tool === "circle") {
      const circle: CircleElement = {
        id: crypto.randomUUID(),
        type: "circle",
        x,
        y,
        width: 0,
        height: 0,
        stroke: strokeColor,
      };

      setDrawingElement(circle);

      return;
    }

    if (tool === "line" || tool === "arrow") {
      const line: LineElement = {
        id: crypto.randomUUID(),
        type: tool,
        start: { x, y },
        end: { x, y },
        stroke: strokeColor,
      };

      setDrawingElement(line);

      return;
    }
  };

  const saveText = useCallback(() => {
    isEditingText.current = false;
    setTextEditor((prev) => {
      if (!prev) return null;

      const value = prev.value.trim();

      if (!value) return null;

      const textElement: CanvasElement = {
        id: crypto.randomUUID(),
        type: "text",
        x: prev.x,
        y: prev.y,
        text: value,
        fontSize: 20,
        stroke: strokeColor,
      };

      setElementsWithHistory((el) => [...el, textElement]);
      setTool("select");

      return null;
    });
  }, [strokeColor]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPanning.current) {
      const dx = e.clientX - lastMouse.current.x;

      const dy = e.clientY - lastMouse.current.y;

      setCamera((prev) => panCamera(prev, dx, dy));

      lastMouse.current = {
        x: e.clientX,
        y: e.clientY,
      };

      return;
    }

    if (!drawingElement) return;

    const { x, y } = getCanvasCoordinates(e);

    if (drawingElement.type === "rectangle") {
      setDrawingElement({
        ...drawingElement,
        width: x - drawingElement.x,
        height: y - drawingElement.y,
      });

      return;
    }

    if (drawingElement.type === "circle") {
      setDrawingElement({
        ...drawingElement,
        width: x - drawingElement.x,
        height: y - drawingElement.y,
      });

      return;
    }

    if (drawingElement.type === "line" || drawingElement.type === "arrow") {
      setDrawingElement({
        ...drawingElement,
        end: { x, y },
      });

      return;
    }
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLTextAreaElement) return; // don't fire while typing

      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      }

      if ((e.ctrlKey || e.metaKey) && e.key === "y") {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      redraw();
    };

    resize();

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    redraw();
  }, [camera, elements, drawingElement]);

  useLayoutEffect(() => {
    if (!textEditor || !textAreaRef || !textAreaRef.current) return;

    textAreaRef.current.focus();
  }, [textEditor]);

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 20,
          left: 20,
          zIndex: 100,
        }}
      >
        <button onClick={() => setTool("rectangle")}>Rectangle</button>

        <button onClick={() => setTool("circle")}>Circle</button>

        <button onClick={() => setTool("line")}>Line</button>

        <button onClick={() => setTool("arrow")}>Arrow</button>

        <button onClick={() => setTool("text")}>Text</button>

        <button onClick={undo} disabled={!canUndo}>
          Undo
        </button>
        <button onClick={redo} disabled={!canRedo}>
          Redo
        </button>
      </div>

      <input
        type="color"
        value={strokeColor}
        onChange={(e) => setStrokeColor(e.target.value)}
      />

      {textEditor && (
        <textarea
          ref={textAreaRef}
          autoFocus
          value={textEditor.value}
          onChange={(e) =>
            setTextEditor((prev) =>
              prev
                ? {
                    ...prev,
                    value: e.target.value,
                  }
                : null,
            )
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              saveText();
            }
          }}
          onBlur={saveText}
          style={{
            position: "fixed",
            left: textEditor.x * camera.zoom + camera.x,
            top: textEditor.y * camera.zoom + camera.y,
            backgroundColor: "transparent",
            color: strokeColor,
            border: "none",
            outline: "none",
            resize: "none",
            overflow: "hidden",
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
      />
    </>
  );
}
