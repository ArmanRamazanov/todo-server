import { type NextFunction, type Response, type Request } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import redis from "../data/redis-db.js";
import { serverErrorHandler } from "@/src/serverErrorHandler.js";

export async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        data: null,
        message: "The token was not provided",
      });
    }

    try {
      const accessTokenPayload = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET!,
      );

      if (
        await redis.get(
          `accessToken:jti:${(accessTokenPayload as JwtPayload).jti}`,
        )
      ) {
        return res.status(401).json({
          success: false,
          data: null,
          message: "The token is no longer available",
        });
      }

      req.userId = (accessTokenPayload as JwtPayload).sub!;
      req.role = (accessTokenPayload as JwtPayload).role!;
      next();
    } catch (error) {
      throw serverErrorHandler(error);
    }
  } catch (error) {
    next(error);
  }
}
