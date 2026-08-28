import { useEffect, type RefObject } from "react";
import type { CanvasElement } from "../components/Canvas/types";
import { deleteElement } from "../editing/delete/deleteElement";

interface UseDeleteShortcutProps {
  selectedElementId: string | null;
  setSelectedElementId: React.Dispatch<React.SetStateAction<string | null>>;
  setElementsWithHistory: (
    updater: CanvasElement[] | ((prev: CanvasElement[]) => CanvasElement[]),
  ) => void;
  disabled?: boolean;
  isDirtyRef: RefObject<boolean>;
}

export function useDeleteShortcut({
  selectedElementId,
  setSelectedElementId,
  setElementsWithHistory,
  disabled,
  isDirtyRef
}: UseDeleteShortcutProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled) return;
      if (e.target instanceof HTMLTextAreaElement) return;

      if (e.key !== "Delete" && e.key !== "Backspace") {
        return;
      }

      if (!selectedElementId) {
        return;
      }

      e.preventDefault();

      setElementsWithHistory((prev) => deleteElement(prev, selectedElementId));

      isDirtyRef.current = true;

      setSelectedElementId(null);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedElementId, setSelectedElementId, setElementsWithHistory, disabled]);
}

