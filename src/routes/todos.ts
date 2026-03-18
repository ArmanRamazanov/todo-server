import { Router } from "express";
import { validateAndHandle } from "@/middleware/validation.js";
import {
  validateTodoQuery,
  validateCreateTodo,
  validateUpdateTodo,
  validateTodoId,
} from "@/middleware/validation.js";
import {
  getAll,
  getById,
  create,
  update,
  del,
  getStatistics,
} from "@/controllers/todoController.js";
const todosRouter = Router();

todosRouter.get("/stats", getStatistics);
todosRouter.get(
  "/",
  validateAndHandle({ todoQuery: validateTodoQuery }),
  getAll,
);
todosRouter.get("/:id", validateAndHandle({ todoId: validateTodoId }), getById);
todosRouter.post(
  "/",
  validateAndHandle({ create: validateCreateTodo }),
  create,
);
todosRouter.put(
  "/:id",
  validateAndHandle({ todoId: validateTodoId, update: validateUpdateTodo }),
  update,
);
todosRouter.delete("/:id", validateAndHandle({ todoId: validateTodoId }), del);

export default todosRouter;
