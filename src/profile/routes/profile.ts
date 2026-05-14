import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
const profileRouter = express.Router();

import type { ApiResponse } from "@/types/index.js";
import { authenticateToken } from "@/registration/middleware/authenticateToken.js";
import type { userWithoutPassword } from "@/types/User.types.js";
import {
  getProfile,
  changeProfile,
} from "@/profile/services/profileService.js";
import {
  sanitizeProfileUpdateInput,
  validateProfileUpdateInput,
} from "../middleware/validation.js";

profileRouter.get(
  "/",
  authenticateToken,
  async (
    req: Request,
    res: Response<ApiResponse<Pick<userWithoutPassword, "profile">>>,
    next: NextFunction,
  ) => {
    try {
      const profile = await getProfile(req.userId);

      res.json({
        success: true,
        data: profile,
        message: null,
      });
    } catch (error) {
      next(error);
    }
  },
);

profileRouter.put(
  "/",
  sanitizeProfileUpdateInput,
  validateProfileUpdateInput,
  authenticateToken,
  async (
    req: Request,
    res: Response<ApiResponse<Pick<userWithoutPassword, "profile"> | null>>,
    next: NextFunction,
  ) => {
    try {
      const { firstName, lastName, bio } = req.body;
      if (!bio && !firstName && !lastName) {
        return res.status(400).json({
          success: false,
          data: null,
          message: "There were no fields provided",
        });
      }
      const result = await changeProfile(req.userId, req.body);

      res.json({
        success: true,
        data: result,
        message: null,
      });
    } catch (error) {
      next(error);
    }
  },
);

profileRouter.get(
  "/:id",
  async (
    req: Request<{ id: string }>,
    res: Response<ApiResponse<Pick<userWithoutPassword, "profile">>>,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params;
      const result = await getProfile(id);

      res.json({
        success: true,
        data: result,
        message: null,
      });
    } catch (error) {
      next(error);
    }
  },
);

export default profileRouter;
