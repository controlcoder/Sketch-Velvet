import type { CanvasElement } from "../components/Canvas/types";

export function updateDrawingElement(
  element: CanvasElement,
  x: number,
  y: number,
): CanvasElement {
  switch (element.type) {
    case "rectangle":
    case "circle":
      return {
        ...element,
        width: x - element.x,
        height: y - element.y,
      };

    case "line":
    case "arrow":
      return {
        ...element,
        end: { x, y },
      };

    default:
      return element;
  }
}
