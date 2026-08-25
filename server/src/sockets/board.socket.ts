import type { Server } from "socket.io";

export function registerBoardSocket(io: Server) {
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("join:board", ({ boardId }) => {
      socket.join(`board:${boardId}`);

      console.log(`${socket.id} joined board:${boardId}`);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
}
