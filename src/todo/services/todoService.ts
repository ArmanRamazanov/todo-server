import {
  type Todo,
  type PaginationQuery,
  type CreateTodoInput,
  type UpdateTodoInput,
  type Statistics,
} from "../../types/Todo.types.js";
import db from "../data/db.js";

export async function getTodos(
  options: PaginationQuery,
  userId: string,
): Promise<{
  todos: Todo[];
  meta: {
    totalTodos: number;
    totalPages: number;
    page: number;
    limit: number;
  };
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
    userId: userId,
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

export async function getTodoById(id: string, userId: string): Promise<Todo> {
  return await db.getTodo(id, userId);
}

export async function createTodo(
  input: CreateTodoInput,
  userId: string,
): Promise<Todo> {
  const { text, priority, completed, dueDate } = input;

  const newTodo = {
    text: text,
    completed: completed ?? false,
    priority: priority ?? "low",
    userId,
    dueDate: dueDate ? new Date(dueDate) : null,
    createdAt: new Date(),
  };

  return await db.addTodo(newTodo, userId);
}

export async function updateTodo(
  id: string,
  input: UpdateTodoInput,
  userId: string,
): Promise<Todo> {
  return await db.updateTodo(id, input, userId);
}

export async function deleteTodo(id: string, userId: string): Promise<true> {
  return await db.deleteTodo(id, userId);
}

export async function getStats(userId: string): Promise<Statistics> {
  const todos = await db.getAllTodos(userId);

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
