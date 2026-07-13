import type { CanvasElement, Point } from "../../components/Canvas/types";
import { isLineElement, isPencilElement } from "../../utils/elementHelpers";

interface moveElementProps {
  element: CanvasElement;
  x: number;
  y: number;
  dragOffset: Point;
}

export function moveElement({ element, x, y, dragOffset }: moveElementProps) {
  if (isLineElement(element)) {
    const dx = x - dragOffset.x - element.start.x;
    const dy = y - dragOffset.y - element.start.y;
    return {
      ...element,
      start: { x: element.start.x + dx, y: element.start.y + dy },
      end: { x: element.end.x + dx, y: element.end.y + dy },
    };
  }

  if (isPencilElement(element)) {
    const dx = x - dragOffset.x - element.points[0].x;
    const dy = y - dragOffset.y - element.points[0].y;
    return {
      ...element,
      points: element.points.map((p) => ({
        x: p.x + dx,
        y: p.y + dy,
      })),
    };
  }

  return {
    ...element,
    x: x - dragOffset.x,
    y: y - dragOffset.y,
  };
}
