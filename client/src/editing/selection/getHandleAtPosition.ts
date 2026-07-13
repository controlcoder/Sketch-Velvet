import type { Camera, CanvasElement, ResizeHandle } from "../../components/Canvas/types";
import { getHandlePositions } from "./getHandlePositions";
import { getBounds } from "./getBounds";

export function getHandleAtPosition(
  element: CanvasElement,
  mouseX: number,
  mouseY: number,
  camera: Camera,
): ResizeHandle | null {
  const bounds = getBounds(element);

  if (!bounds) return null;

  const x = bounds.x - 8;
  const y = bounds.y - 8;
  const width = bounds.width + 16;
  const height = bounds.height + 16;

  const handles = getHandlePositions(x, y, width, height);

  for (const handle of handles) {
    const screenX = handle.x * camera.zoom + camera.x;
    const screenY = handle.y * camera.zoom + camera.y;

    if (
      mouseX >= screenX - 6 &&
      mouseX <= screenX + 6 &&
      mouseY >= screenY - 6 &&
      mouseY <= screenY + 6
    ) {
      return handle.id as ResizeHandle;
    }
  }

  return null;
}
