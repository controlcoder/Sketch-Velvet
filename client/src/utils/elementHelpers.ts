import type { CanvasElement, CircleElement, LineElement, PencilElement, RectangleElement, TextElement } from "../components/Canvas/types";

export function isLineElement(element: CanvasElement): element is LineElement {
  return element.type === "line" || element.type === "arrow";
}

export function isPencilElement(
  element: CanvasElement,
): element is PencilElement {
  return element.type === "pencil";
}

export function isPositionedElement(
  element: CanvasElement,
): element is RectangleElement | CircleElement | TextElement {
  return (
    element.type === "rectangle" ||
    element.type === "circle" ||
    element.type === "text"
  );
}
