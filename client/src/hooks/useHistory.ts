import {
  useCallback,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { CanvasElement } from "../components/Canvas/types";

export function useHistory(
  setElements: Dispatch<SetStateAction<CanvasElement[]>>,
) {
  const historyRef = useRef<{
    past: CanvasElement[][];
    present: CanvasElement[];
    future: CanvasElement[][];
  }>({ past: [], present: [], future: [] });

  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const undo = useCallback(() => {
    const { past, present, future } = historyRef.current;
    if (past.length === 0) return;

    historyRef.current = {
      past: past.slice(0, -1),
      present: past[past.length - 1],
      future: [present, ...future],
    };

    setCanUndo(historyRef.current.past.length > 0);
    setCanRedo(historyRef.current.future.length > 0);

    setElements(historyRef.current.present);
  }, []);

  const redo = useCallback(() => {
    const { past, present, future } = historyRef.current;
    if (future.length === 0) return;

    historyRef.current = {
      past: [...past, present],
      present: future[0],
      future: future.slice(1),
    };

    setCanUndo(historyRef.current.past.length > 0);
    setCanRedo(historyRef.current.future.length > 0);

    setElements(historyRef.current.present);
  }, []);

  const setElementsWithHistory = useCallback(
    (
      updater: CanvasElement[] | ((prev: CanvasElement[]) => CanvasElement[]),
    ) => {
      setElements((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;

        historyRef.current = {
          past: [...historyRef.current.past, prev],
          present: next,
          future: [],
        };

        setCanUndo(historyRef.current.past.length > 0);
        setCanRedo(historyRef.current.future.length > 0);

        return next;
      });
    },
    [],
  );

  const commitHistory = useCallback(
    (previous: CanvasElement[], next: CanvasElement[]) => {
      historyRef.current = {
        past: [...historyRef.current.past, previous],
        present: next,
        future: [],
      };

      setCanUndo(historyRef.current.past.length > 0);
      setCanRedo(false);

      setElements(next);
    },
    [setElements],
  );

  return {
    canUndo,
    canRedo,
    historyRef,
    undo,
    redo,
    setElementsWithHistory,
    commitHistory,
  };
}
