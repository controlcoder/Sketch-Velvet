import { api } from "./axios";

const baseURL = `/api/boards`;

export const boardApi = {
  create(title: string) {
    return api.post(`${baseURL}`, {
      title,
    });
  },

  getAll() {
    return api.get(`${baseURL}`);
  },

  get(boardId: string) {
    return api.get(`${baseURL}/${boardId}`);
  },

  update(boardId: string, data: unknown) {
    return api.patch(`${baseURL}/${boardId}`, data);
  },

  delete(boardId: string) {
    return api.delete(`${baseURL}/${boardId}`);
  },
};
