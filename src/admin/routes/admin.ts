import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";

import {
  changeRole,
  getUsers,
  changeStatus,
  getStatistics,
  getUserTodos,
} from "@/admin/services/adminServices.js";
import type { ApiResponse } from "@/types/index.js";
import type { userWithoutPassword } from "@/types/User.types.js";
import { authenticateToken } from "@/registration/middleware/authenticateToken.js";
import { requireRole } from "@/registration/middleware/requireRole.js";
import type { Todo } from "@/types/Todo.types.js";

const adminRouter = express.Router();

adminRouter.get(
  "/users",
  authenticateToken,
  requireRole(["admin"]),
  async (
    req: Request,
    res: Response<
      ApiResponse<{
        users: userWithoutPassword[];
        meta: {
          totalUsers: number;
          totalPages?: number;
          page: number;
          limit?: number;
        };
      }>
    >,
    next: NextFunction,
  ) => {
    try {
      const result = await getUsers(req.query);

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

adminRouter.put(
  "/:id/role",
  authenticateToken,
  requireRole(["admin"]),
  async (
    req: Request<{ id: string }>,
    res: Response<ApiResponse<userWithoutPassword>>,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params;
      const { role } = req.body;
      const result = await changeRole(req.userId, id, role);

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

adminRouter.put(
  "/:id/status",
  authenticateToken,
  requireRole(["admin"]),
  async (
    req: Request<{ id: string }>,
    res: Response<ApiResponse<userWithoutPassword>>,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params;
      const result = await changeStatus(req.userId, id);
    } catch (error) {
      next(error);
    }
  },
);

adminRouter.get(
  "/statistics",
  authenticateToken,
  requireRole(["admin"]),
  async (
    req: Request,
    res: Response<
      ApiResponse<{
        byRole: Record<string, number>;
        byStatus: Record<string, number>;
        completedTodos: number;
        pendingTodos: number;
      }>
    >,
    next: NextFunction,
  ) => {
    try {
      const result = await getStatistics();

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

adminRouter.get(
  "/:id/todos",
  authenticateToken,
  requireRole(["admin"]),
  async (
    req: Request<{ id: string }>,
    res: Response<
      ApiResponse<{
        todos: Todo[];
        meta: {
          totalTodos: number;
          totalPages: number;
          page: number;
          limit: number;
        };
      }>
    >,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params;
      const result = await getUserTodos(id, req.query);

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

export default adminRouter;
