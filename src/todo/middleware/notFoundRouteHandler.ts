import type { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/error.js";
export default function notFoundErrorHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const error = new CustomError(
    "The route was not found",
    404,
    "NotFoundError",
  );
  next(error);
}
