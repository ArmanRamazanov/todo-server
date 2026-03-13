import type { NextFunction, Request, Response } from "express";

export function errorHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    error: error.name,
    message: error.message,
  });
}
