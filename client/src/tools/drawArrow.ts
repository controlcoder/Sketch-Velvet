import type { LineElement } from "../components/Canvas/types";
import { drawLine } from "./drawLine";

export function drawArrow(
  ctx: CanvasRenderingContext2D,
  element: LineElement
) {
  drawLine(ctx, element);

  const angle = Math.atan2(
    element.end.y - element.start.y,
    element.end.x - element.start.x
  );

  const size = 12;

  ctx.beginPath();

  ctx.moveTo(
    element.end.x,
    element.end.y
  );

  ctx.lineTo(
    element.end.x -
      size * Math.cos(angle - Math.PI / 6),
    element.end.y -
      size * Math.sin(angle - Math.PI / 6)
  );

  ctx.moveTo(
    element.end.x,
    element.end.y
  );

  ctx.lineTo(
    element.end.x -
      size * Math.cos(angle + Math.PI / 6),
    element.end.y -
      size * Math.sin(angle + Math.PI / 6)
  );

  ctx.stroke();
}