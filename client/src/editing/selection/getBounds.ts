// tells what should be the dimension of selected element

import type { CanvasElement } from "../../components/Canvas/types";
import { measureText } from "../resize/measureText";

export function getBounds(element: CanvasElement) {
  switch (element.type) {
    case "rectangle":
    case "circle":
      return {
        x: Math.min(element.x, element.x + element.width),
        y: Math.min(element.y, element.y + element.height),
        width: Math.abs(element.width),
        height: Math.abs(element.height),
      };

    case "line":
    case "arrow":
      return {
        x: Math.min(element.start.x, element.end.x),
        y: Math.min(element.start.y, element.end.y),
        width: Math.abs(element.end.x - element.start.x),
        height: Math.abs(element.end.y - element.start.y),
      };

    case "text":
      const { width, height } = measureText(element.text, element.fontSize);
      return {
        x: element.x,
        y: element.y - 20,
        width,
        height
      };
  }
}
