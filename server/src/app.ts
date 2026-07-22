import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.VITE_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (_, res) => {
  res.send("Server running...");
});

export default app;
