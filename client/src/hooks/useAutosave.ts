import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";

import type { Camera, CanvasElement } from "../components/Canvas/types";
import { boardApi } from "../api/board.api";

interface UseAutosaveProps {
  boardId: string;
  elements: CanvasElement[];
  camera: Camera;
  isViewer?: boolean;
}

export function useAutosave({ boardId, elements, camera, isViewer }: UseAutosaveProps) {
  const autosaveMutation = useMutation({
    mutationFn: ({
      boardId,
      elements,
      camera,
    }: Omit<UseAutosaveProps, "isViewer">) =>
      boardApi.update(boardId, { elements, viewport: camera }),
    onError: (error) => {
      console.error("Failed to save board", error);
    },
  });

  useEffect(() => {
    if (!boardId || isViewer) return;

    const timeout = setTimeout(() => {
      autosaveMutation.mutate({ boardId, elements, camera });
    }, 500);

    return () => clearTimeout(timeout);
  }, [boardId, elements, camera]);
}

