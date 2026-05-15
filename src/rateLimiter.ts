import { Ratelimit } from "@upstash/ratelimit";
import type { ApiResponse } from "./types/index.js";
import { Redis } from "@upstash/redis";
import redis from "@/registration/data/redis-db.js";
import type { Request, Response, NextFunction } from "express";

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "15m"),
});

const loginRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "15m"),
});

export const rateLimitMiddleware = async (
  req: Request,
  res: Response<ApiResponse<null>>,
  next: NextFunction,
) => {
  const identifier = req.userId ?? req.ip ?? "unknown";

  const { success } = await ratelimit.limit(identifier);

  if (!success) {
    return res.status(429).json({
      success: false,
      data: null,
      message: "Too many requests. Please try again later.",
    });
  }

  next();
};

export const loginRateLimitMiddleware = async (
  req: Request,
  res: Response<ApiResponse<null>>,
  next: NextFunction,
) => {
  const { success } = await loginRatelimit.limit(req.ip ?? "unknown");

  if (!success) {
    return res.status(429).json({
      success: false,
      data: null,
      message: "Too many login attempts. Please try again later.",
    });
  }

  next();
};
