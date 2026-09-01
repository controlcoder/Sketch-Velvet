import type { CanvasElement } from "../components/Canvas/types";

export type ElementChange =
  | {
      type: "create";
      element: CanvasElement;
    }
  | {
      type: "update";
      element: CanvasElement;
    }
  | {
      type: "delete";
      elementId: string;
    };

export function getChangedElements(
  previous: CanvasElement[],
  current: CanvasElement[],
): ElementChange[] {
  const changes: ElementChange[] = [];

  const previousMap = new Map(previous.map((element) => [element.id, element]));

  const currentMap = new Map(current.map((element) => [element.id, element]));

  for (const currentElement of current) {
    const previousElement = previousMap.get(currentElement.id);

    if (!previousElement) {
      changes.push({
        type: "create",
        element: currentElement,
      });
      continue;
    }

    if (JSON.stringify(previousElement) !== JSON.stringify(currentElement)) {
      changes.push({
        type: "update",
        element: currentElement,
      });
    }
  }

  for (const previousElement of previous) {
    if (!currentMap.has(previousElement.id)) {
      changes.push({
        type: "delete",
        elementId: previousElement.id,
      });
    }
  }

  return changes;
}
