import { useEffect } from "react";
import { boardApi } from "../api/board.api";
import type { Camera, CanvasElement } from "../components/Canvas/types";

interface UseSavedElementsProps {
  boardId: string;
  setElements: React.Dispatch<React.SetStateAction<CanvasElement[]>>;
  setCamera: React.Dispatch<React.SetStateAction<Camera>>;
}

export function useSavedElements({
  boardId,
  setElements,
  setCamera,
}: UseSavedElementsProps) {
  const getBoardInfo = async () => {
    if (!boardId) return;
    const { data } = await boardApi.get(boardId);
    setElements(data.board.elements);
    setCamera(data.board.viewport);
  };

  useEffect(() => {
    getBoardInfo();
  }, []);
}
