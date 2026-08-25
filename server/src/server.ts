import dotenv from "dotenv";
dotenv.config();

import http from "http";
import app from "./app";
import { createSocketServer } from "./sockets/server";
import { prisma } from "./config/prisma";

const PORT = process.env.PORT || 5000;

const httpServer = http.createServer(app);

createSocketServer(httpServer);

httpServer.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});

async function start() {
  try {
    await prisma.$connect();

    console.log("Database Connected");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

start();
