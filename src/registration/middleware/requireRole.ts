import type { Request, Response, NextFunction } from "express";
import type { ApiResponse } from "@/types/index.js";

export function requireRole(
  roles: string[],
): (
  req: Request,
  res: Response<ApiResponse<null>>,
  next: NextFunction,
) => void {
  return async function (req: Request, res: Response, next: NextFunction) {
    if (!roles.includes(req.role)) {
      return res.status(401).json({
        success: false,
        data: null,
        message: "The user is not authorized to access this page",
      });
    }

    next();
  };
}
