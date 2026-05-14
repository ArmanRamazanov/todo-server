import { type NextFunction, type Response, type Request } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import redis from "../data/redis-db.js";

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

    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!,
      async (err, decoded) => {
        console.log(err);
        if (err) {
          return res.status(403).json({
            success: false,
            data: null,
            nessage: "The token is invalid",
          });
        }

        console.log(decoded);
        if (await redis.get(`accessToken:jti:${(decoded as JwtPayload).jti}`)) {
          return res.status(401).json({
            success: false,
            data: null,
            message: "The token is no longer available",
          });
        }

        req.userId = (decoded as JwtPayload).sub!;
        req.role = (decoded as JwtPayload).role!;
        next();
      },
    );
  } catch (error) {
    next(error);
  }
}
