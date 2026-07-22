import { prisma } from "../config/prisma";
import { comparePassword, hashPassword } from "../utils/hash";
import type { LoginInput, SignupInput } from "../schemas/auth.schema";
import { generateToken } from "../utils/jwt";
import { AppError } from "../utils/AppError";
import { JwtPayload } from "../types/auth.types";

export async function signup(data: SignupInput) {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (existingUser) {
    throw new AppError("User already exists", 409);
  }

  const hashedPassword = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
    },
  });

  const token = generateToken(user.id);

  const { password, ...safeUser } = user;

  return {
    user: safeUser,
    token,
  };
}

export async function login(data: LoginInput) {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const valid = await comparePassword(data.password, user.password);

  if (!valid) {
    throw new AppError("Invalid credentials", 401);
  }

  const token = generateToken(user.id);

  const { password, ...safeUser } = user;

  return {
    user: safeUser,
    token,
  };
}

export async function me(payload: JwtPayload) {
  const user = await prisma.user.findUnique({
    where: {
      id: payload.userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

  return user;
}

