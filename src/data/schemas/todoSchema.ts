import mongoose from "mongoose";
import type { Todo } from "@/types/todo.types.js";
import { Priority } from "@/types/todo.types.js";

const todoSchema = new mongoose.Schema<Todo>(
  {
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
    priority: {
      type: String,
      enum: Object.values(Priority),
      default: Priority.Low,
    },
    dueDate: { type: Date },
  },
  { timestamps: true },
);

todoSchema.index({ createdAt: -1 });
todoSchema.index({ dueDate: 1 });
todoSchema.index({ completed: 1 });
todoSchema.index({ priority: 1 });

const TodosModel = mongoose.model<Todo>("Todo", todoSchema);

export default TodosModel;
