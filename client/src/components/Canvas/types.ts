export type Tool =
  | "select"
  | "pan"
  | "rectangle"
  | "circle"
  | "line"
  | "arrow"
  | "pencil"
  | "text";

export interface Point {
  x: number;
  y: number;
}

export interface Camera {
  x: number;
  y: number;
  zoom: number;
}

interface BaseElement {
  id: string;
  type: Tool;
}

export interface RectangleElement extends BaseElement {
  type: "rectangle";
  x: number;
  y: number;
  width: number;
  height: number;
  stroke: string;
}

export interface CircleElement {
  id: string;
  type: "circle";
  x: number;
  y: number;
  width: number;
  height: number;
  stroke: string;
}

export interface LineElement extends BaseElement {
  type: "line" | "arrow";
  start: Point;
  end: Point;
  stroke: string;
}

export interface PencilElement extends BaseElement {
  type: "pencil";
  points: Point[];
}

export interface TextElement extends BaseElement {
  type: "text";
  x: number;
  y: number;
  text: string;
  fontSize: number;
  stroke: string;
}

export type CanvasElement =
  | RectangleElement
  | CircleElement
  | LineElement
  | PencilElement
  | TextElement;