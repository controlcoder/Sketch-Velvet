import type { Camera, Point } from "./types";

export function screenToWorld(
  screenX: number,
  screenY: number,
  camera: Camera
): Point {
  return {
    x: (screenX - camera.x) / camera.zoom,
    y: (screenY - camera.y) / camera.zoom,
  };
}

export function worldToScreen(
  worldX: number,
  worldY: number,
  camera: Camera
): Point {
  return {
    x: worldX * camera.zoom + camera.x,
    y: worldY * camera.zoom + camera.y,
  };
}

export function panCamera(
  camera: Camera,
  deltaX: number,
  deltaY: number
): Camera {
  return {
    ...camera,
    x: camera.x + deltaX,
    y: camera.y + deltaY,
  };
}

export function zoomCamera(
  camera: Camera,
  delta: number
): Camera {
  const zoomFactor = 0.01;

  const zoom =
    delta < 0
      ? camera.zoom * (1 + zoomFactor)
      : camera.zoom * (1 - zoomFactor);

  return {
    ...camera,
    zoom: Math.max(0.1, Math.min(5, zoom)),
  };
}