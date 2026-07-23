import { prisma } from "../config/prisma";
import type { CreateBoardInput, UpdateBoardInput } from "../schemas/board.schema";
import { AppError } from "../utils/AppError";

async function findBoardOrThrow(boardId: string, userId: string) {
  const board = await prisma.board.findFirst({
    where: {
      id: boardId,
      ownerId: userId,
    },
  });

  if (!board) {
    throw new AppError("Board not found", 404);
  }

  return board;
}

export async function createBoard(userId: string, data: CreateBoardInput) {
  return prisma.board.create({
    data: {
      title: data.title,
      ownerId: userId,
      elements: [],
      viewport: {
        x: 0,
        y: 0,
        zoom: 1,
      },
    },
  });
}

export async function getBoards(userId: string) {
  return prisma.board.findMany({
    where: {
      ownerId: userId,
    },
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function getBoard(boardId: string, userId: string) {
  return findBoardOrThrow(boardId, userId);
}

export async function updateBoard(
  boardId: string,
  userId: string,
  data: UpdateBoardInput,
) {
  await findBoardOrThrow(boardId, userId);

  return prisma.board.update({
    where: {
      id: boardId,
    },
    data,
  });
}

export async function deleteBoard(boardId: string, userId: string) {
  await findBoardOrThrow(boardId, userId);

  return await prisma.board.delete({
    where: {
      id: boardId,
    },
  });
}