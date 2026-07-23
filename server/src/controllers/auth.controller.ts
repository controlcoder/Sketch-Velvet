import { loginSchema, signupSchema } from "../schemas/auth.schema";
import * as authService from "../services/auth.service";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";

export const signup = asyncHandler(async (req, res) => {
  const data = signupSchema.parse(req.body);

  const result = await authService.signup(data);

  res.cookie("token", result.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    success: true,
    user: result.user,
  });
});

export const login = asyncHandler(async (req, res) => {
  const data = loginSchema.parse(req.body);

  const result = await authService.login(data);

  res.cookie("token", result.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    success: true,
    user: result.user,
  });
});

export const logout = (req: Request, res: Response) => {
  res.clearCookie("token");

  res.json({
    success: true,
    message: "Logged out successfully",
  });
};

export const me = asyncHandler(async (req, res) => {
  const payload = req.user;

  const user = authService.me(payload);

  res.json({
    success: true,
    user,
  });
});
