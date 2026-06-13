import { useEffect } from "react";

export function useCanvasSize(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  redraw: () => void
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      redraw();
    };

    resize();

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, [canvasRef, redraw]);
}