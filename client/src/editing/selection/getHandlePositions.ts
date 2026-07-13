// 

export function getHandlePositions(
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const cx = x + width / 2;
  const cy = y + height / 2;

  return [
    { id: "nw", x: x, y: y },
    { id: "n", x: cx, y: y },
    { id: "ne", x: x + width, y: y },
    { id: "e", x: x + width, y: cy },
    { id: "se", x: x + width, y: y + height },
    { id: "s", x: cx, y: y + height },
    { id: "sw", x: x, y: y + height },
    { id: "w", x: x, y: cy },
  ];
}
