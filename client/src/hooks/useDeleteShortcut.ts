import { useEffect, type RefObject } from "react";
import type { CanvasElement } from "../components/Canvas/types";
import { deleteElement } from "../editing/delete/deleteElement";
import { socket } from "../config/socket";

interface UseDeleteShortcutProps {
  selectedElementId: string | null;
  setSelectedElementId: React.Dispatch<React.SetStateAction<string | null>>;
  setElements: React.Dispatch<React.SetStateAction<CanvasElement[]>>;
  recordDelete: (element: CanvasElement, index?: number) => void;
  disabled?: boolean;
  isDirtyRef: RefObject<boolean>;
  boardId: string;
}

export function useDeleteShortcut({
  selectedElementId,
  setSelectedElementId,
  setElements,
  recordDelete,
  disabled,
  isDirtyRef,
  boardId,
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

      setElements((prev) => {
        const index = prev.findIndex((el) => el.id === selectedElementId);
        if (index !== -1) {
          recordDelete(prev[index], index);
        }
        return deleteElement(prev, selectedElementId);
      });

      isDirtyRef.current = true;

      socket.emit("element:delete", {
        boardId,
        elementId: selectedElementId,
      });

      setSelectedElementId(null);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    selectedElementId,
    setSelectedElementId,
    setElements,
    recordDelete,
    disabled,
    boardId,
    isDirtyRef,
  ]);
}
