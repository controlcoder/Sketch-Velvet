import { useEffect } from "react";

interface Props {
  handleUndo: () => void;
  handleRedo: () => void;
  setZoomIn: () => void;
  setZoomOut: () => void;
  resetZoom: () => void;
  disabled?: boolean;
}

export function useKeyboardShortcuts({
  handleUndo,
  handleRedo,
  setZoomIn,
  setZoomOut,
  resetZoom,
  disabled,
}: Props) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLTextAreaElement) return;

      const isModifier = e.ctrlKey || e.metaKey;

      if (!disabled && isModifier && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) handleRedo();
        else handleUndo();
      }

      if (!disabled && isModifier && e.key === "y") {
        e.preventDefault();
        handleRedo();
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
  }, [handleUndo, handleRedo, disabled]);
}

