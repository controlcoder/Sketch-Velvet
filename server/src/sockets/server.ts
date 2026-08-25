import type { Server as HTTPServer } from "http";
import { Server } from "socket.io";
import { registerBoardSocket } from "./board.socket";

export function createSocketServer(httpServer: HTTPServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  registerBoardSocket(io);

  return io;
}
