import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { type ApiResponse } from "@/types/index.js";
import { type userWithoutPassword } from "@/types/User.types.js";
import {
  signup,
  emailVerification,
  resendEmail,
  login,
  logout,
  newTokenGeneration,
} from "@/registration/services/authService.js";

import {
  signupSanitization,
  signupValidator,
  resendEmailValidator,
  LoginSanitization,
} from "@/registration/middleware/validation.js";

const registrationRouter = express.Router();

registrationRouter.post(
  "/register",
  signupSanitization,
  signupValidator,
  async (
    req: Request,
    res: Response<ApiResponse<userWithoutPassword>>,
    next: NextFunction,
  ) => {
    try {
      const result = await signup(req.body);

      res.status(201).json({
        success: true,
        data: result,
        message: null,
      });
    } catch (error) {
      next(error);
    }
  },
);

registrationRouter.get(
  "/email-verify",
  async (
    req: Request<{ token: string }>,
    res: Response<ApiResponse<null>>,
    next: NextFunction,
  ) => {
    try {
      const { token } = req.query;

      if (!token || typeof token !== "string") {
        return res.status(400).json({
          success: false,
          data: null,
          message: "The verification link is expired or invalid",
        });
      }

      const result = await emailVerification(token);

      return res.json({
        success: true,
        data: null,
        message: "The email was verified successfully",
      });
    } catch (error) {
      next(error);
    }
  },
);

registrationRouter.post(
  "/resend",
  resendEmailValidator,
  async (
    req: Request,
    res: Response<ApiResponse<null>>,
    next: NextFunction,
  ) => {
    try {
      const result = await resendEmail(req.body);

      res.json({
        success: true,
        data: null,
        message: "The email was successfully resent",
      });
    } catch (error) {
      next(error);
    }
  },
);

registrationRouter.post(
  "/login",
  LoginSanitization,
  async (
    req: Request,
    res: Response<ApiResponse<{ accessToken: string }>>,
    next: NextFunction,
  ) => {
    try {
      const result = await login(req.body);
      const { accessToken, refreshToken } = result;
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return res.json({
        success: true,
        data: { accessToken },
        message: "The user was successfully logged in",
      });
    } catch (error) {
      next(error);
    }
  },
);

registrationRouter.post(
  "/token",
  async (
    req: Request,
    res: Response<ApiResponse<{ accessToken: string }>>,
    next: NextFunction,
  ) => {
    try {
      const result = await newTokenGeneration(req.cookies.refreshToken);
      res.json({
        success: true,
        data: { accessToken: result },
        message: "The new token was successfully generated",
      });
    } catch (error) {
      next(error);
    }
  },
);

registrationRouter.post(
  "/logout",
  async (
    req: Request,
    res: Response<ApiResponse<null>>,
    next: NextFunction,
  ) => {
    try {
      const accessToken = req.headers["authorization"]?.split(" ")[1];
      console.log("cookies: ", req.cookies);

      const result = await logout(req.cookies.refreshToken, accessToken);
      if (result) {
        res.clearCookie("refreshToken", {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
        });

        return res.json({
          success: true,
          data: null,
          message: "The user successfully logged out",
        });
      }

      throw new Error("Something went wrong");
    } catch (error) {
      next(error);
    }
  },
);

export default registrationRouter;
