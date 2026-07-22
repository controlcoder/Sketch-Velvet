import { useEffect } from "react";
import type { CanvasElement } from "../components/Canvas/types";
import { deleteElement } from "../editing/delete/deleteElement";

interface UseDeleteShortcutProps {
  selectedElementId: string | null;
  setSelectedElementId: React.Dispatch<React.SetStateAction<string | null>>;
  setElementsWithHistory: (
    updater: CanvasElement[] | ((prev: CanvasElement[]) => CanvasElement[]),
  ) => void;
}

export function useDeleteShortcut({
  selectedElementId,
  setSelectedElementId,
  setElementsWithHistory,
}: UseDeleteShortcutProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLTextAreaElement) return;

      if (e.key !== "Delete" && e.key !== "Backspace") {
        return;
      }

      if (!selectedElementId) {
        return;
      }

      e.preventDefault();

      setElementsWithHistory((prev) => deleteElement(prev, selectedElementId));

      setSelectedElementId(null);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedElementId, setSelectedElementId, setElementsWithHistory]);
}
