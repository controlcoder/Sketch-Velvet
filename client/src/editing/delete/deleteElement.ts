import type { CanvasElement } from "../../components/Canvas/types";

export function deleteElement(elements: CanvasElement[], elementId: string) {
  return elements.filter((element) => element.id !== elementId);
}
