import type { Server } from "socket.io";
import cookieParser from "cookie-parser";
import { verifyToken } from "../utils/jwt";

export function socketMiddleware(io: Server) {
  io.use((socket, next) => {
    const cookieHeader = socket.handshake.headers.cookie;

    const token = cookieHeader
      ?.split(";")
      .find((cookie) => cookie.trim().startsWith("token="))
      ?.split("=")
      .slice(1)
      .join("=");

    if (!token) {
      return next(new Error("Authentication required"));
    }

    try {
      const payload = verifyToken(token);
      socket.data.userId = payload.userId;
      next();
    } catch (error) {
      next(new Error("Invalid or expired token"));
    }
  });
}
