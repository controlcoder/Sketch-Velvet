import type { RectangleElement } from "../components/Canvas/types";

export function drawRectangle(
  ctx: CanvasRenderingContext2D,
  element: RectangleElement,
) {
  ctx.strokeStyle = element.stroke;
  ctx.strokeRect(element.x, element.y, element.width, element.height);
}
