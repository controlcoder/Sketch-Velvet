import type { PencilElement } from "../components/Canvas/types";

export function drawPencil(
  ctx: CanvasRenderingContext2D,
  element: PencilElement,
) {
  const points = element.points;

  // console.log(points);

  if (points.length < 2){
    return;
  }

  ctx.beginPath();

  ctx.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }

  ctx.strokeStyle = element.stroke;
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.stroke();
}
