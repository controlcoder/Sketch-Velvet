import { useEffect, useRef } from "react";
import type { CanvasElement } from "../components/Canvas/types";
import { boardRepository } from "../services";

interface UseBoardProps {
  BOARD_ID: string;
  elements: CanvasElement[];
  loadHistory: (elements: CanvasElement[]) => void;
}

export function useBoard({ BOARD_ID, elements, loadHistory }: UseBoardProps) {
  const hasLoaded = useRef(false);

  useEffect(() => {
    const load = async () => {
      const storedElements = await boardRepository.load(BOARD_ID);

      loadHistory(storedElements);
      hasLoaded.current = true;
    };

    load();
  }, [BOARD_ID, loadHistory]);

  useEffect(() => {
    if (!hasLoaded.current) return;

    boardRepository.save(BOARD_ID, elements);
  }, [BOARD_ID, elements]);
}
