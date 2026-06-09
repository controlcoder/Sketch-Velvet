import type { PencilElement } from "../components/Canvas/types";


export function drawPencil(
  ctx: CanvasRenderingContext2D,
  element: PencilElement
) {
  if (element.points.length < 2) return;

  ctx.beginPath();

  ctx.moveTo(
    element.points[0].x,
    element.points[0].y
  );

  for (let i = 1; i < element.points.length; i++) {
    ctx.lineTo(
      element.points[i].x,
      element.points[i].y
    );
  }

  ctx.stroke();
}