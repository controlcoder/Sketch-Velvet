import type { CircleElement, ResizeHandle } from "../../components/Canvas/types";
import { resizeBounds } from "./resizeBounds";

export function resizeCircle(
  element: CircleElement,
  handle: ResizeHandle,
  mouseX: number,
  mouseY: number,
): CircleElement {
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
