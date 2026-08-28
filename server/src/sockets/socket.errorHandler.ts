import { AppError } from "../utils/AppError";

export function socketErrorHandler(error: unknown) {
  if (error instanceof AppError) {
    return {
      success: false,
      message: error.message,
      statusCode: error.statusCode,
    };
  }

  // console.error("Socket error:", error);

  return {
    success: false,
    message: "Internal Server Error",
    statusCode: 500,
  };
}
