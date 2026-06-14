import type { CanvasElement } from "../components/Canvas/types";
import { getBounds } from "./getBounds";
import { getHandlePositions } from "./getHandlePositions";

let dashOffset = 0;

export function drawSelection(
  ctx: CanvasRenderingContext2D,
  element: CanvasElement,
  animate = true,
) {
  ctx.save();

  const bounds = getBounds(element);

  if (!bounds) return null;

  const x = bounds.x - 8;
  const y = bounds.y - 8;
  const width = bounds.width + 16;
  const height = bounds.height + 16;

  ctx.strokeStyle = "#6965db";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([6, 4]);
  ctx.lineDashOffset = animate ? -dashOffset : 0;
  ctx.strokeRect(x, y, width, height);

  const handles = getHandlePositions(x, y, width, height);

  for (const handle of handles) {
    ctx.shadowColor = "rgba(105, 101, 219, 0.3)";
    ctx.shadowBlur = 4;

    ctx.setLineDash([]);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(handle.x - 5, handle.y - 5, 10, 10);

    ctx.shadowBlur = 0;
    ctx.strokeStyle = "#6965db";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(handle.x - 5, handle.y - 5, 10, 10);
  }

  ctx.restore();

  if (animate) dashOffset = (dashOffset + 0.3) % 20;
}
