import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { ZodError } from "zod";

export function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.error(error);

  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: error.issues[0].message,
    });
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }
  
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
}
