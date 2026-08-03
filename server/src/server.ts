import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { prisma } from "./config/prisma";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
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
