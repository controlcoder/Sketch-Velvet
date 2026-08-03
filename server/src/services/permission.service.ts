import { prisma } from "../config/prisma";

export async function getMembership(boardId: string, userId: string) {
  return prisma.boardMember.findUnique({
    where: {
      boardId_userId: {
        boardId,
        userId,
      },
    },
  });
}

export async function isOwner(boardId: string, userId: string) {
  const member = await getMembership(boardId, userId);

  return member?.role === "OWNER";
}

export async function canEdit(boardId: string, userId: string) {
  const member = await getMembership(boardId, userId);

  if (!member) {
    return false;
  }

  return member.role === "OWNER" || member.role === "EDITOR";
}

export async function canView(boardId: string, userId: string) {
  const member = await getMembership(boardId, userId);

  return !!member;
}

export async function canShare(boardId: string, userId: string) {
  return isOwner(boardId, userId);
}
