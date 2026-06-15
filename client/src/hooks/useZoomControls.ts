import { setZoom } from "../components/Canvas/Camera";
import type { Camera } from "../components/Canvas/types";
import { ZOOM_STEP } from "../constants/camera";

export function useZoomControls(
  setCamera: React.Dispatch<React.SetStateAction<Camera>>,
) {
  const setZoomIn = () => {
    setCamera((prev) => setZoom(prev, prev.zoom * (1 + ZOOM_STEP * 10)));
  };

  const setZoomOut = () => {
    setCamera((prev) => setZoom(prev, prev.zoom * (1 - ZOOM_STEP * 10)));
  };

  const resetZoom = () => {
    setCamera((prev) => setZoom(prev, 1));
  };

  return { setZoomIn, setZoomOut, resetZoom };
}
