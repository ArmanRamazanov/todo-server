import { Router } from "express";
import { validateAndHandle } from "../middleware/validation.js";
import {
  validateTodoQuery,
  validateCreateTodo,
  validateUpdateTodo,
  validateTodoId,
} from "../middleware/validation.js";
import {
  getAll,
  getById,
  create,
  update,
  del,
  getStatistics,
} from "../controllers/todoController.js";
import { authenticateToken } from "@/registration/middleware/authenticateToken.js";
import { requireEmailVerified } from "@/registration/middleware/requireEmailVerified.js";

const todosRouter = Router();

todosRouter.get(
  "/stats",
  authenticateToken,
  requireEmailVerified,
  getStatistics,
);
todosRouter.get(
  "/",
  authenticateToken,
  requireEmailVerified,
  validateAndHandle({ todoQuery: validateTodoQuery }),
  getAll,
);
todosRouter.get(
  "/:id",
  authenticateToken,
  requireEmailVerified,
  validateAndHandle({ todoId: validateTodoId }),
  getById,
);
todosRouter.post(
  "/",
  authenticateToken,
  requireEmailVerified,
  validateAndHandle({ create: validateCreateTodo }),
  create,
);
todosRouter.put(
  "/:id",
  authenticateToken,
  requireEmailVerified,
  validateAndHandle({ todoId: validateTodoId, update: validateUpdateTodo }),
  update,
);
todosRouter.delete(
  "/:id",
  authenticateToken,
  requireEmailVerified,
  validateAndHandle({ todoId: validateTodoId }),
  del,
);

export default todosRouter;
