import type { CanvasElement } from "../components/Canvas/types";

export interface BoardRepository {
  load(boardId: string): Promise<CanvasElement[]>;
  save(boardId: string, elements: CanvasElement[]): Promise<void>;
}
