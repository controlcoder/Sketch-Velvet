export function measureText(
  text: string,
  fontSize: number,
) {
  return {
    width: text.length * fontSize * 0.6,
    height: fontSize,
  };
}