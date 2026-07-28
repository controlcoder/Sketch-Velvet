import { useEffect } from "react";

import type { Camera, CanvasElement } from "../components/Canvas/types";
import { boardApi } from "../api/board.api";

interface UseAutosaveProps {
  boardId: string;
  elements: CanvasElement[];
  camera: Camera;
}

export function useAutosave({ boardId, elements, camera }: UseAutosaveProps) {
  useEffect(() => {
    if (!boardId) return;

    const timeout = setTimeout(async () => {
      try {
        await boardApi.update(boardId, { elements, viewport: camera });

      } catch (err) {
        console.error("Failed to save board", err);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [boardId, elements, camera]);
}
