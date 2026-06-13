import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
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
import { useCanvasSize } from "../../hooks/useCanvaSize";
import { useKeyboardShortcuts } from "../../hooks/useKeyboardShortcuts";
import { Box, Button, TextField } from "@mui/material";

import { toolbarConfig } from "../Toolbar/ToolbarConfig";
import ToolButton from "../Toolbar/ToolButton";

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

  const { undo, redo, canUndo, canRedo, setElementsWithHistory } =
    useHistory(setElements);

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

  useKeyboardShortcuts({ undo, redo });

  useCanvasSize(canvasRef, redraw);

  useEffect(() => {
    redraw();
  }, [camera, elements, drawingElement]);

  useLayoutEffect(() => {
    if (!textEditor || !textAreaRef || !textAreaRef.current) return;

    textAreaRef.current.focus();
  }, [textEditor]);

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          top: 30,
          left: "35%",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        {toolbarConfig.map((item) => {
          const Icon = item.icon;

          return (
            <ToolButton
              key={item.key}
              title={item.title}
              active={tool === item.key}
              onClick={() => setTool(item.key as Tool)}
            >
              <Icon
                sx={{
                  color: "black",
                  fontSize: 20,
                }}
              />
            </ToolButton>
          );
        })}

        <TextField
          type="color"
          value={strokeColor}
          sx={{
            width: 40,
            "& .MuiInputBase-root": {
              height: 28,
              padding: "0px 2px",
            },
            "& input": {
              height: 28,
              padding: 0,
              cursor: "pointer",
            },
          }}
          onChange={(e) => setStrokeColor(e.target.value)}
        />
      </Box>

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
      <Box
        sx={{
          position: "fixed",
          left: 30,
          bottom: 30,
          display: "flex",
          justifyContent: "space-between",
          bgcolor: "#E0DFFF",
          borderRadius: 2,
          width: 120,
          padding: "5px 10px",
        }}
      >
        <Button
          onClick={undo}
          disabled={!canUndo}
          sx={{
            minWidth: 0,
            padding: "1px 4px",
            fontSize: "12px",
            bgcolor: "white",
          }}
        >
          Undo
        </Button>
        <Button
          onClick={redo}
          disabled={!canRedo}
          sx={{
            minWidth: 0,
            padding: "1px 4px",
            fontSize: "12px",
            bgcolor: "white",
          }}
        >
          Redo
        </Button>
      </Box>
    </>
  );
}
