import {
  useCallback,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { CanvasElement } from "../components/Canvas/types";
import type { ElementChange } from "./historyChange";

export type HistoryAction =
  | {
      type: "create";
      element: CanvasElement;
    }
  | {
      type: "delete";
      element: CanvasElement;
      index?: number;
    }
  | {
      type: "update";
      before: CanvasElement;
      after: CanvasElement;
    };

export function useHistory(
  setElements: Dispatch<SetStateAction<CanvasElement[]>>,
) {
  const undoStackRef = useRef<HistoryAction[]>([]);
  const redoStackRef = useRef<HistoryAction[]>([]);

  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const updateFlags = useCallback(() => {
    setCanUndo(undoStackRef.current.length > 0);
    setCanRedo(redoStackRef.current.length > 0);
  }, []);

  const clearHistory = useCallback(() => {
    undoStackRef.current = [];
    redoStackRef.current = [];
    setCanUndo(false);
    setCanRedo(false);
  }, []);

  const loadHistory = useCallback(
    (elements: CanvasElement[]) => {
      clearHistory();
      setElements(elements);
    },
    [clearHistory, setElements],
  );

  const recordAction = useCallback(
    (action: HistoryAction) => {
      undoStackRef.current.push(action);
      redoStackRef.current = [];
      updateFlags();
    },
    [updateFlags],
  );

  const recordCreate = useCallback(
    (element: CanvasElement) => {
      recordAction({ type: "create", element });
    },
    [recordAction],
  );

  const recordDelete = useCallback(
    (element: CanvasElement, index?: number) => {
      recordAction({ type: "delete", element, index });
    },
    [recordAction],
  );

  const recordUpdate = useCallback(
    (before: CanvasElement, after: CanvasElement) => {
      if (JSON.stringify(before) === JSON.stringify(after)) return;
      recordAction({ type: "update", before, after });
    },
    [recordAction],
  );

  const undo = useCallback((): ElementChange[] | null => {
    if (undoStackRef.current.length === 0) return null;

    const action = undoStackRef.current.pop()!;
    redoStackRef.current.push(action);
    updateFlags();

    const changes: ElementChange[] = [];

    if (action.type === "create") {
      setElements((prev) => prev.filter((el) => el.id !== action.element.id));
      changes.push({
        type: "delete",
        elementId: action.element.id,
      });
    } else if (action.type === "delete") {
      setElements((prev) => {
        if (prev.some((el) => el.id === action.element.id)) return prev;
        const next = [...prev];
        if (
          typeof action.index === "number" &&
          action.index >= 0 &&
          action.index <= prev.length
        ) {
          next.splice(action.index, 0, action.element);
          return next;
        }
        return [...prev, action.element];
      });
      changes.push({
        type: "create",
        element: action.element,
      });
    } else if (action.type === "update") {
      setElements((prev) => {
        const exists = prev.some((el) => el.id === action.before.id);
        if (exists) {
          return prev.map((el) =>
            el.id === action.before.id ? action.before : el,
          );
        }
        return [...prev, action.before];
      });
      changes.push({
        type: "update",
        element: action.before,
      });
    }

    return changes;
  }, [setElements, updateFlags]);

  const redo = useCallback((): ElementChange[] | null => {
    if (redoStackRef.current.length === 0) return null;

    const action = redoStackRef.current.pop()!;
    undoStackRef.current.push(action);
    updateFlags();

    const changes: ElementChange[] = [];

    if (action.type === "create") {
      setElements((prev) => {
        const exists = prev.some((el) => el.id === action.element.id);
        if (exists) {
          return prev.map((el) =>
            el.id === action.element.id ? action.element : el,
          );
        }
        return [...prev, action.element];
      });
      changes.push({
        type: "create",
        element: action.element,
      });
    } else if (action.type === "delete") {
      setElements((prev) => prev.filter((el) => el.id !== action.element.id));
      changes.push({
        type: "delete",
        elementId: action.element.id,
      });
    } else if (action.type === "update") {
      setElements((prev) => {
        const exists = prev.some((el) => el.id === action.after.id);
        if (exists) {
          return prev.map((el) =>
            el.id === action.after.id ? action.after : el,
          );
        }
        return [...prev, action.after];
      });
      changes.push({
        type: "update",
        element: action.after,
      });
    }

    return changes;
  }, [setElements, updateFlags]);

  return {
    canUndo,
    canRedo,
    undo,
    redo,
    recordAction,
    recordCreate,
    recordDelete,
    recordUpdate,
    clearHistory,
    loadHistory,
  };
}
