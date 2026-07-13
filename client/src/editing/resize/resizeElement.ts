import type { CanvasElement, ResizeHandle } from "../../components/Canvas/types";
import { resizeCircle } from "./resizeCircle";
import { resizeRectangle } from "./resizeRectangle";

export function resizeElement(
  element: CanvasElement,
  handle: ResizeHandle,
  mouseX: number,
  mouseY: number,
): CanvasElement {
  switch (element.type) {
    case "rectangle":
      return resizeRectangle(element, handle, mouseX, mouseY);

    case "circle":
      return resizeCircle(element, handle, mouseX, mouseY);

    default:
      return element;
  }
}
