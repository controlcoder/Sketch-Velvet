// checks which type of element you are pointing to

import { drawArrow } from "../../tools/drawArrow";
import { drawCircle } from "../../tools/drawCircle";
import { drawLine } from "../../tools/drawLine";
import { drawPencil } from "../../tools/drawPencil";
import { drawRectangle } from "../../tools/drawRectangle";
import { drawText } from "../../tools/drawText";
import { drawGrid } from "./drawGrid";
import { drawSelection } from "../../selection/drawSelection";
import type { Camera, CanvasElement } from "./types";

export function renderScene(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  elements: CanvasElement[],
  camera: Camera,
  selectedElementId: string | null,
  drawingElement: CanvasElement | null,
) {
  ctx.clearRect(0, 0, width, height);

  ctx.save();

  ctx.translate(camera.x, camera.y);
  ctx.scale(camera.zoom, camera.zoom);

  drawGrid(ctx, width, height, camera);

  elements.forEach((element) => {
    switch (element.type) {
      case "rectangle":
        drawRectangle(ctx, element);
        if (element.id === selectedElementId) {
          drawSelection(ctx, element);
        }
        break;

      case "circle":
        drawCircle(ctx, element);
        if (element.id === selectedElementId) {
          drawSelection(ctx, element);
        }
        break;

      case "line":
        drawLine(ctx, element);
        if (element.id === selectedElementId) {
          drawSelection(ctx, element);
        }
        break;

      case "arrow":
        const isDrawing = drawingElement?.id === element.id;

        if (isDrawing) {
          drawLine(ctx, element);
        } else {
          drawArrow(ctx, element);
        }
        if (element.id === selectedElementId) {
          drawSelection(ctx, element);
        }
        break;

      case "pencil":
        drawPencil(ctx, element);
        if (element.id === selectedElementId) {
          drawSelection(ctx, element);
        }
        break;

      case "text":
        drawText(ctx, element);
        if (element.id === selectedElementId) {
          drawSelection(ctx, element);
        }
        break;
    }
  });

  ctx.restore();
}
