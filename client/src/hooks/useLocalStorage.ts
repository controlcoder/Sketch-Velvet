import { useEffect, useRef } from "react";
import type { CanvasElement } from "../components/Canvas/types";

export function useLocalStorage(
  elements: CanvasElement[],
  loadHistory: (elements: CanvasElement[]) => void,
) {

  const hasLoaded = useRef(false);

  useEffect(() => {
    const stored = localStorage.getItem("elements");

    if (stored) {
      loadHistory(JSON.parse(stored));
    }
    hasLoaded.current = true;
  }, [loadHistory]);

  useEffect(() => {
    if (!hasLoaded.current) return;
    localStorage.setItem("elements", JSON.stringify(elements));
  }, [elements]);
}
