import type { Request, Response, NextFunction } from "express";
import type { ApiResponse } from "@/types/index.js";

export async function errorHandler(
  error: any,
  req: Request,
  res: Response<ApiResponse<null | { field: string }>>,
  next: NextFunction,
) {
  const statusCode = error.status || 500;
  const { details, message } = error;

  res.status(statusCode).json({
    success: false,
    data: (details as { field: string }) ?? null,
    message: details ? null : (message ?? null),
  });
}
