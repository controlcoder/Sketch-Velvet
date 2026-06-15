import type { Camera, CanvasElement } from "../components/Canvas/types";
import { HANDLE_CURSORS } from "./cursors";
import { getHandleAtPosition } from "./getHandleAtPosition";
import { hitTest } from "./hitTest";

export function updateCursor(
  canvas: HTMLCanvasElement,
  selectedElement: CanvasElement | null,
  mouseX: number,
  mouseY: number,
  camera: Camera,
) {
  if (!selectedElement) {
    canvas.style.cursor = "default";
    return;
  }
  const handle = getHandleAtPosition(selectedElement, mouseX, mouseY, camera);

  if (handle) {
    canvas.style.cursor = HANDLE_CURSORS[handle];
    return;
  }

  const worldX = (mouseX - camera.x) / camera.zoom;

  const worldY = (mouseY - camera.y) / camera.zoom;

  const isOverElement = hitTest(selectedElement, worldX, worldY);

  canvas.style.cursor = isOverElement ? "move" : "default";
}