import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";

import type { Camera, CanvasElement } from "../components/Canvas/types";
import { boardApi } from "../api/board.api";

interface UseAutosaveProps {
  boardId: string;
  elements: CanvasElement[];
  camera: Camera;
}

export function useAutosave({ boardId, elements, camera }: UseAutosaveProps) {
  const autosaveMutation = useMutation({
    mutationFn: ({
      boardId,
      elements,
      camera,
    }: UseAutosaveProps) =>
      boardApi.update(boardId, { elements, viewport: camera }),
    onError: (error) => {
      console.error("Failed to save board", error);
    },
  });

  useEffect(() => {
    if (!boardId) return;

    const timeout = setTimeout(() => {
      autosaveMutation.mutate({ boardId, elements, camera });
    }, 500);

    return () => clearTimeout(timeout);
  }, [boardId, elements, camera]);
}
