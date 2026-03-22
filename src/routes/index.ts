import { Router } from "express";
import todosRouter from "@/routes/todos.js";

const router = Router();

router.use("/todos", todosRouter);

export default router;
