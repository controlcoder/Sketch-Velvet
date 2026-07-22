import type {
  TextElement,
} from "../../components/Canvas/types";
import { measureText } from "./measureText";

export function resizeText(
  element: TextElement,
  mouseX: number,
): TextElement {
  const { width: currentWidth } = measureText(element.text, element.fontSize);

  const delta = mouseX - element.x;

  const scale = delta / currentWidth;

  return {
    ...element,
    fontSize: Math.max(
      8,
      Math.round(element.fontSize * scale),
    ),
  };
}