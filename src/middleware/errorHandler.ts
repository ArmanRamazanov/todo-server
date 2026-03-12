import type { NextFunction, Request, Response } from "express";
import { CustomError } from "../utils/error.js";

export function errorHandler(
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { statusCode } = error;

  res.status(statusCode).json({
    success: false,
    error: error.name,
    message: error.message,
  });
}
