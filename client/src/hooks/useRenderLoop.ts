import { useEffect, useRef } from "react";

export function useRenderLoop(redraw: () => void) {
  const redrawRef = useRef(redraw);

  useEffect(() => {
    redrawRef.current = redraw;
  }, [redraw]);

  useEffect(() => {
    let animationId: number;

    const loop = () => {
      redrawRef.current();
      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(animationId);
  }, []);
}