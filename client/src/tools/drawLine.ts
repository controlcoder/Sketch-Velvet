import type { LineElement } from "../components/Canvas/types";

export function drawLine(ctx: CanvasRenderingContext2D, element: LineElement) {
  ctx.strokeStyle = element.stroke;

  ctx.beginPath();

  ctx.moveTo(element.start.x, element.start.y);

  ctx.lineTo(element.end.x, element.end.y);

  ctx.stroke();
}
