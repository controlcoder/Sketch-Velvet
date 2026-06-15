import { MAX_ZOOM, MIN_ZOOM, ZOOM_STEP } from "../../constants/camera";
import type { Camera, Point } from "./types";

export function screenToWorld(
  screenX: number,
  screenY: number,
  camera: Camera,
): Point {
  return {
    x: (screenX - camera.x) / camera.zoom,
    y: (screenY - camera.y) / camera.zoom,
  };
}

export function worldToScreen(
  worldX: number,
  worldY: number,
  camera: Camera,
): Point {
  return {
    x: worldX * camera.zoom + camera.x,
    y: worldY * camera.zoom + camera.y,
  };
}

export function panCamera(
  camera: Camera,
  deltaX: number,
  deltaY: number,
): Camera {
  return {
    ...camera,
    x: camera.x + deltaX,
    y: camera.y + deltaY,
  };
}

export function zoomCamera(camera: Camera, delta: number): Camera {
  const zoom =
    delta < 0 ? camera.zoom * (1 + ZOOM_STEP) : camera.zoom * (1 - ZOOM_STEP);

  return {
    ...camera,
    zoom: Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom)),
  };
}

export function setZoom(camera: Camera, zoom: number): Camera {
  return {
    ...camera,
    zoom: Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom)),
  };
}