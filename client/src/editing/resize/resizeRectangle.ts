import type {
  RectangleElement,
  ResizeHandle,
} from "../../components/Canvas/types";
import { resizeBounds } from "./resizeBounds";

export function resizeRectangle(
  element: RectangleElement,
  handle: ResizeHandle,
  mouseX: number,
  mouseY: number,
): RectangleElement {
  return {
    ...element,
    ...resizeBounds(
      element.x,
      element.y,
      element.width,
      element.height,
      handle,
      mouseX,
      mouseY,
    ),
  };
}
