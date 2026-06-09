import type { TextElement } from "../components/Canvas/types";

export function drawText(ctx: CanvasRenderingContext2D, element: TextElement) {
  ctx.font = `${element.fontSize}px Arial`;

  ctx.fillStyle = element.stroke;

  ctx.fillText(element.text, element.x, element.y);
}
