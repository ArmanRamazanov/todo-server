import {
  type Todo,
  type PaginationQuery,
  type CreateTodoInput,
  type UpdateTodoInput,
  type Statistics,
} from "@/types/todo.types.js";
import db from "@/data/db.js";
import mongoose from "mongoose";

export async function getTodos(options: PaginationQuery): Promise<{
  todos: Todo[];
  meta:
    | {
        totalTodos: number;
        totalPages?: number;
        page: number;
        limit?: number;
      }
    | { error: string };
}> {
  let {
    page = 1,
    limit = 10,
    completed,
    priority,
    search,
    sortBy,
    sortOrder = "asc",
  } = options;

  page = typeof page === "string" ? parseInt(page) : page;
  limit = typeof limit === "string" ? parseInt(limit) : limit;

  const filter = {
    ...(completed !== undefined && { completed: completed === "true" }),
    ...(priority && { priority }),
    ...(search && { text: { $regex: search, $options: "i" } }),
  };

  const sort = {
    ...(sortBy && { [sortBy]: sortOrder === "asc" ? 1 : -1 }),
  } as Record<string, 1 | -1>;

  const { todos, totalFiltered } = await db.getTodos(page, limit, filter, sort);

  return {
    todos,
    meta: {
      totalTodos: totalFiltered,
      totalPages: Math.ceil(totalFiltered / limit),
      page: page,
      limit: limit,
    },
  };
}

export async function getTodoById(
  id: string,
): Promise<Todo | null | { error: string }> {
  return await db.getTodo(id);
}

export async function createTodo(
  input: CreateTodoInput,
): Promise<Todo | { error: string }> {
  const { text, priority, completed, dueDate } = input;

  const newTodo = {
    _id: new mongoose.Types.ObjectId().toString(),
    text: text.trim(),
    completed: completed ?? false,
    priority: priority ?? "low",
    ...(dueDate && { dueDate: new Date(dueDate) }),
    createdAt: new Date(),
  };

  return await db.addTodo(newTodo as Todo);
}

export async function updateTodo(
  id: string,
  input: UpdateTodoInput,
): Promise<Todo | { error: string }> {
  const todo = await db.updateTodo(id, input);
  return todo;
}

export async function deleteTodo(
  id: string,
): Promise<boolean | { error: string }> {
  const result = await db.deleteTodo(id);
  return result;
}

export async function getStats(): Promise<Statistics | { error: string }> {
  const todos = await db.getAllTodos();

  if ("error" in todos) {
    return { error: todos.error };
  }

  const completed = todos.filter((todo) => todo.completed).length;
  const byPriority = todos.reduce(
    (acc, currentValue) => {
      if (!acc.hasOwnProperty(currentValue.priority)) {
        acc[currentValue.priority] = 0;
      }
      acc[currentValue.priority]++;
      return acc;
    },
    {} as Statistics["byPriority"],
  );
  return {
    total: todos.length,
    completed: completed,
    pending: todos.length - completed,
    byPriority: byPriority,
  };
}
