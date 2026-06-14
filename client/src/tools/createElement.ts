import type {
  Tool,
  CanvasElement,
  RectangleElement,
  CircleElement,
  LineElement,
} from "../components/Canvas/types";

export function createElement(
  tool: Tool,
  x: number,
  y: number,
  stroke: string,
): CanvasElement | null {
  switch (tool) {
    case "rectangle":
      return {
        id: crypto.randomUUID(),
        type: "rectangle",
        x,
        y,
        width: 0,
        height: 0,
        stroke,
      } satisfies RectangleElement;

    case "circle":
      return {
        id: crypto.randomUUID(),
        type: "circle",
        x,
        y,
        width: 0,
        height: 0,
        stroke,
      } satisfies CircleElement;

    case "line":
    case "arrow":
      return {
        id: crypto.randomUUID(),
        type: tool,
        start: { x, y },
        end: { x, y },
        stroke,
      } satisfies LineElement;

    default:
      return null;
  }
}
