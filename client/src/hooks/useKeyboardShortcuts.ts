import { useEffect } from "react";

interface Props {
  undo: () => void;
  redo: () => void;
  setZoomIn: () => void;
  setZoomOut: () => void;
  resetZoom: () => void;
}

export function useKeyboardShortcuts({
  undo,
  redo,
  setZoomIn,
  setZoomOut,
  resetZoom,
}: Props) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLTextAreaElement) return;

      const isModifier = e.ctrlKey || e.metaKey;

      if (isModifier && e.key === "z") {
        console.log("zzzzzzzz");
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      }

      if (isModifier && e.key === "y") {
        e.preventDefault();
        redo();
      }

      if (isModifier && (e.key === "+" || e.key === "=")) {
        e.preventDefault();
        setZoomIn();
        return;
      }

      if (isModifier && e.key === "-") {
        e.preventDefault();
        setZoomOut();
        return;
      }

      if (isModifier && e.key === "0") {
        e.preventDefault();
        resetZoom();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);
}
