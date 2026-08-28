import type { Server } from "socket.io";
import * as permissionService from "../services/permission.service";
import { socketHandler } from "./socket.asyncHandler";
import { AppError } from "../utils/AppError";

export function registerBoardSocket(io: Server) {
  io.on("connection", (socket) => {
    // console.log("Client connected:", socket.id, socket.data.userId);
  
    socket.on(
      "join:board",
      socketHandler(async ({ boardId }: { boardId: string }) => {
        const userId = socket.data.userId;
        const member = await permissionService.getMembership(boardId, userId);
        if (!member) {
          throw new AppError("You don't have access to this board", 403);
        }
        socket.join(`board:${boardId}`);
        return {
          role: member.role,
        };
      }),
    );

    socket.on("element:create", ({ boardId, element }) => {
      console.log(element);
      socket
        .to(`board:${boardId}`)
        .emit("element:create", { element, userId: socket.data.userId });
    });

    socket.on("element:delete", ({ boardId, elementId }) => {
      socket
        .to(`board:${boardId}`)
        .emit("element:delete", { elementId, userId: socket.data.userId });
    });

    // socket.on("disconnect", () => {
    //   console.log("Client disconnected:", socket.id, socket.data.userId);
    // });
  });
}
