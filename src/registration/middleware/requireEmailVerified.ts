import type { Request, Response, NextFunction } from "express";
import { checkUserVerified } from "../services/authService.js";
import type { ApiResponse } from "@/types/index.js";

export async function requireEmailVerified(
  req: Request,
  res: Response<ApiResponse<null>>,
  next: NextFunction,
) {
  try {
    const result = checkUserVerified(req.userId);

    if (!result) {
      return res.status(403).json({
        success: false,
        data: null,
        message: "The user has not verified his account yet",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
}
