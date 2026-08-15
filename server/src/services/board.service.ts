import { prisma } from "../config/prisma";
import type {
  CreateBoardInput,
  UpdateBoardInput,
} from "../schemas/board.schema";
import { AppError } from "../utils/AppError";
import { BoardRole } from "@prisma/client";
import * as permissionService from "../services/permission.service";
import { ShareBoardInput } from "../schemas/share.schema";

async function findBoardById(boardId: string) {
  const board = await prisma.board.findUnique({
    where: {
      id: boardId,
    },
  });

  if (!board) {
    throw new AppError("Board not found", 404);
  }

  return board;
}

export async function createBoard(userId: string, data: CreateBoardInput) {
  return prisma.$transaction(async (tx) => {
    const board = await tx.board.create({
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

    await tx.boardMember.create({
      data: {
        boardId: board.id,
        userId,
        role: BoardRole.OWNER,
      },
    });

    return board;
  });
}

export async function getBoards(userId: string) {
  const memberships = await prisma.boardMember.findMany({
    where: {
      userId,
    },
    include: {
      board: {
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: {
      board: {
        updatedAt: "desc",
      },
    },
  });

  const ownedBoards = memberships
    .filter((member) => member.role === "OWNER")
    .map(({ board }) => ({
      id: board.id,
      title: board.title,
      createdAt: board.createdAt,
      updatedAt: board.updatedAt,
    }));

  const sharedBoards = memberships
    .filter((member) => member.role === "EDITOR")
    .map(({ board, role }) => ({
      id: board.id,
      title: board.title,
      createdAt: board.createdAt,
      updatedAt: board.updatedAt,
      role,
      owner: {
        id: board.owner.id,
        name: board.owner.name,
        email: board.owner.email,
      },
    }));

  return {
    ownedBoards,
    sharedBoards,
  };
}

export async function getBoard(boardId: string, userId: string) {
  const board = await findBoardById(boardId);

  const allowed = await permissionService.canView(boardId, userId);

  if (!allowed) {
    throw new AppError("You don't have permission to view this board", 403);
  }

  return board;
}

export async function updateBoard(
  boardId: string,
  userId: string,
  data: UpdateBoardInput,
) {
  await findBoardById(boardId);

  const allowed = await permissionService.canEdit(boardId, userId);

  if (!allowed) {
    throw new AppError("You don't have permission to edit this board", 403);
  }

  return prisma.board.update({
    where: {
      id: boardId,
    },
    data,
  });
}

export async function deleteBoard(boardId: string, userId: string) {
  await findBoardById(boardId);

  const isOwner = await permissionService.isOwner(boardId, userId);

  if (!isOwner) {
    throw new AppError("Only the owner can delete this board", 403);
  }

  await prisma.board.delete({
    where: {
      id: boardId,
    },
  });
}

export async function shareBoard(
  boardId: string,
  ownerId: string,
  data: ShareBoardInput,
) {
  await findBoardById(boardId);

  const allowed = await permissionService.canShare(boardId, ownerId);
  if (!allowed) {
    throw new AppError("You don't have permission to share this board", 403);
  }

  const invitedUser = await prisma.user.findUnique({
    where: {
      email: data.email.toLowerCase().trim(),
    },
  });

  if (!invitedUser) {
    throw new AppError("user with this email not exists", 404);
  }

  if (invitedUser.id === ownerId) {
    throw new AppError("You already own this board", 400);
  }

  const existingMember = await permissionService.getMembership(
    boardId,
    invitedUser.id,
  );

  if (existingMember) {
    throw new AppError("This user is already a collaborator", 409);
  }

  await prisma.boardMember.create({
    data: {
      boardId,
      userId: invitedUser.id,
      role: data.role,
    },
  });
}

export async function getBoardMembers(boardId: string, userId: string) {
  await findBoardById(boardId);

  const allowed = await permissionService.canView(boardId, userId);

  if (!allowed) {
    throw new AppError("You don't have permission to view this board", 403);
  }

  const members = await prisma.boardMember.findMany({
    where: {
      boardId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      
    },
    orderBy: {
      role: "asc",
    },
  });

  return members.map((member) => ({
    userId: member.user.id,
    name: member.user.name,
    email: member.user.email,
    role: member.role,
  }));
}

export async function removeMember(
  boardId: string,
  ownerId: string,
  memberId: string,
) {
  await findBoardById(boardId);

  const allowed = await permissionService.isOwner(boardId, ownerId);

  if (!allowed) {
    throw new AppError("You don't have permission", 403);
  }

  if (memberId === ownerId) {
    throw new AppError("Owner cannot remove themselves", 400);
  }

  const member = await permissionService.getMembership(boardId, memberId);
  if (!member) {
    throw new AppError("Collaborator not found", 404);
  }

  if (member.role === "OWNER") {
    throw new AppError("Owner cannot be removed", 400);
  }

  await prisma.boardMember.delete({
    where: {
      boardId_userId: {
        boardId,
        userId: memberId,
      },
    },
  });
}
