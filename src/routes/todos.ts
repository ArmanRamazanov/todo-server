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
  patch,
  del,
} from "@/controllers/todoController.js";
const router = Router();

router.get("/", validateAndHandle({ todoQuery: validateTodoQuery }), getAll);
router.get("/:id", validateAndHandle({ todoId: validateTodoId }), getById);
router.post("/", validateAndHandle({ create: validateCreateTodo }), create);
router.put(
  "/:id",
  validateAndHandle({ todoId: validateTodoId, update: validateUpdateTodo }),
  update,
);
router.patch(
  "/:id",
  validateAndHandle({ todoId: validateTodoId, update: validateUpdateTodo }),
  patch,
);
router.delete("/:id", validateAndHandle({ todoId: validateTodoId }), del);

export default router;
