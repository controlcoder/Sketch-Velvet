import { api } from "./axios";

export const boardApi = {
  create(title: string) {
    return api.post("/boards", {
      title,
    });
  },

  getAll() {
    return api.get("/boards");
  },

  get(boardId: string) {
    return api.get(`/boards/${boardId}`);
  },

  update(boardId: string, data: unknown) {
    return api.patch(`/boards/${boardId}`, data);
  },

  delete(boardId: string) {
    return api.delete(`/boards/${boardId}`);
  },
};
