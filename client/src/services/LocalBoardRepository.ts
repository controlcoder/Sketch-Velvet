import type { CanvasElement } from "../components/Canvas/types";
import type { BoardRepository } from "./BoardRepository";

export class LocalBoardRepository implements BoardRepository {
  async load(boardId: string): Promise<CanvasElement[]> {
    const data = localStorage.getItem(`board:${boardId}`);

    if (!data) {
      return [];
    }

    return JSON.parse(data);
  }

  async save(boardId: string, elements: CanvasElement[]): Promise<void> {
    localStorage.setItem(`board:${boardId}`, JSON.stringify(elements));
  }
}
