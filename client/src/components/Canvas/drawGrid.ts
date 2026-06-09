import type { Camera } from "./types";

const GRID_SIZE = 40;

export function drawGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  camera: Camera
) {
  const worldLeft = -camera.x / camera.zoom;
  const worldTop = -camera.y / camera.zoom;

  const worldRight =
    worldLeft + width / camera.zoom;

  const worldBottom =
    worldTop + height / camera.zoom;

  const startX =
    Math.floor(worldLeft / GRID_SIZE) * GRID_SIZE;

  const startY =
    Math.floor(worldTop / GRID_SIZE) * GRID_SIZE;

  ctx.beginPath();

  for (let x = startX; x <= worldRight; x += GRID_SIZE) {
    ctx.moveTo(x, worldTop);
    ctx.lineTo(x, worldBottom);
  }

  for (let y = startY; y <= worldBottom; y += GRID_SIZE) {
    ctx.moveTo(worldLeft, y);
    ctx.lineTo(worldRight, y);
  }

  ctx.strokeStyle = "#e5e7eb";
  ctx.lineWidth = 1 / camera.zoom;
  ctx.stroke();
}