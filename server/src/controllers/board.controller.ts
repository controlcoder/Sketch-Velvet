import { asyncHandler } from "../utils/asyncHandler";
import * as boardService from "../services/board.service";
import { createBoardSchema, updateBoardSchema } from "../schemas/board.schema";

export const createBoard = asyncHandler(async (req, res) => {
  const data = createBoardSchema.parse(req.body);

  const board = await boardService.createBoard(req.user.userId, data);

  res.status(201).json({
    success: true,
    board,
  });
});

export const getBoards = asyncHandler(async (req, res) => {
  const boards = await boardService.getBoards(req.user.userId);

  res.json({
    success: true,
    boards,
  });
});

export const getBoard = asyncHandler(async (req, res) => {
  const board = await boardService.getBoard(
    req.params.id as string,
    req.user.userId,
  );

  res.json({
    success: true,
    board,
  });
});

export const updateBoard = asyncHandler(async (req, res) => {
  const data = updateBoardSchema.parse(req.body);

  const board = await boardService.updateBoard(
    req.params.id as string,
    req.user.userId,
    data,
  );

  res.json({
    success: true,
    board,
  });
});

export const deleteBoard = asyncHandler(async (req, res) => {
  await boardService.deleteBoard(req.params.id as string, req.user.userId);

  res.json({
    success: true,
    message: "Board deleted successfully",
  });
});