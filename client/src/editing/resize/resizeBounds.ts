import type { ResizeHandle } from "../../components/Canvas/types";

export function resizeBounds(
  x: number,
  y: number,
  width: number,
  height: number,
  handle: ResizeHandle,
  mouseX: number,
  mouseY: number,
) {
  let left = x;
  let right = x + width;

  let top = y;
  let bottom = y + height;

  switch (handle) {
    case "e":
      right = mouseX;
      break;

    case "w":
      left = mouseX;
      break;

    case "n":
      top = mouseY;
      break;

    case "s":
      bottom = mouseY;
      break;

    case "ne":
      right = mouseX;
      top = mouseY;
      break;

    case "nw":
      left = mouseX;
      top = mouseY;
      break;

    case "se":
      right = mouseX;
      bottom = mouseY;
      break;

    case "sw":
      left = mouseX;
      bottom = mouseY;
      break;
  }

  return {
    x: Math.min(left, right),
    y: Math.min(top, bottom),
    width: Math.abs(right - left),
    height: Math.abs(bottom - top),
  };
}
