// will find whether the cursor lies inside element or not

import type {
  CanvasElement,
  CircleElement,
  LineElement,
  RectangleElement,
  TextElement,
} from "../components/Canvas/types";

export function hitTest(element: CanvasElement, x: number, y: number): boolean {
  switch (element.type) {
    case "rectangle":
      return hitTestRectangle(element, x, y);
    case "circle":
      return hitTestCircle(element, x, y);
    case "line":
    case "arrow":
      return hitTestLine(element, x, y);
    case "text":
      return hitTestText(element, x, y);
    case "pencil":
      return false;
    default:
      return false;
  }
}

// Point inside rectangle
function hitTestRectangle(
  element: RectangleElement,
  x: number,
  y: number,
): boolean {
  const minX = Math.min(element.x, element.x + element.width);
  const minY = Math.min(element.y, element.y + element.height);
  const maxX = Math.max(element.x, element.x + element.width);
  const maxY = Math.max(element.y, element.y + element.height);

  return x >= minX && x <= maxX && y >= minY && y <= maxY;
}

// Point inside ellipse
function hitTestCircle(element: CircleElement, x: number, y: number): boolean {
  const cx = element.x + element.width / 2;
  const cy = element.y + element.height / 2;
  const rx = Math.abs(element.width / 2);
  const ry = Math.abs(element.height / 2);

  // ellipse equation: (x-cx)²/rx² + (y-cy)²/ry² <= 1
  return (
    Math.pow(x - cx, 2) / Math.pow(rx, 2) +
      Math.pow(y - cy, 2) / Math.pow(ry, 2) <=
    1
  );
}

// Point near a line segment (within threshold)
function hitTestLine(element: LineElement, x: number, y: number): boolean {
  const { start, end } = element;
  const threshold = 6; // pixels tolerance

  // distance from point to line segment
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const lengthSq = dx * dx + dy * dy;

  if (lengthSq === 0) {
    // zero length line, check distance to point
    return Math.hypot(x - start.x, y - start.y) <= threshold;
  }

  // project point onto line, clamp to segment
  const t = Math.max(
    0,
    Math.min(1, ((x - start.x) * dx + (y - start.y) * dy) / lengthSq),
  );

  const nearestX = start.x + t * dx;
  const nearestY = start.y + t * dy;

  return Math.hypot(x - nearestX, y - nearestY) <= threshold;
}

// Point inside text bounding box (approximate)
function hitTestText(element: TextElement, x: number, y: number): boolean {
  const width = element.text.length * (element.fontSize * 0.6); // approximate
  const height = element.fontSize;

  return (
    x >= element.x &&
    x <= element.x + width &&
    y >= element.y - height &&
    y <= element.y
  );
}
