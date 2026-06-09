import type { CircleElement } from "../components/Canvas/types";

export function drawCircle(
  ctx: CanvasRenderingContext2D,
  element: CircleElement
) {
  ctx.beginPath();

  ctx.strokeStyle = element.stroke;

  ctx.ellipse(
    element.x + element.width / 2,
    element.y + element.height / 2,
    Math.abs(element.width) / 2,
    Math.abs(element.height) / 2,
    0,
    0,
    Math.PI * 2
  );

  ctx.stroke();
}
