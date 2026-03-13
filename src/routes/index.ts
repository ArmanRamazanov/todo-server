import { Router } from "express";
import { health } from "@/controllers/todoController.js";
import todosRouter from "@/routes/todos.js";

const router = Router();

router.use("/todos", todosRouter);
router.get("/health", health);

export default router;
