import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes";
import boardRoutes from "./routes/board.routes";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (_, res) => {
  res.send("Server running...");
});

app.use("/api/auth", authRouter);
app.use("/api/boards", boardRoutes);

app.use(errorHandler);

export default app;
