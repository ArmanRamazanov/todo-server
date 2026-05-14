import express from "express";

const router = express.Router();

import registrationRouter from "@/registration/routes/registration.js";
import profileRouter from "@/profile/routes/profile.js";
import adminRouter from "@/admin/routes/admin.js";
import todosRouter from "@/todo/routes/todos.js";

router.use("/auth", registrationRouter);
router.use("/profile", profileRouter);
router.use("/admin", adminRouter);
router.use("/todos", todosRouter);

export default router;
