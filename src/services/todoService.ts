import type {
  Todo,
  PaginationQuery,
  CreateTodoInput,
  UpdateTodoInput,
  Statistics,
} from "@/types/todo.types.ts";

import { filter } from "@/utils/helperFunctions/filterFunction.js";
import { sort } from "@/utils/helperFunctions/sortFunction.js";
import db from "@/data/todos.js";

let nextId = db.getTodos().length;

export function getTodos(options: PaginationQuery): {
  todos: Todo[];
  meta: {
    totalTodos: number;
    totalPages?: number;
    page: number;
    limit?: number;
  };
} {
  let {
    page = 1,
    limit = 10,
    completed,
    priority,
    search,
    sortBy,
    sortOrder = "asc",
  } = options;
  let filteredTodos: Todo[] = [];

  const todos = db.getTodos();

  page = typeof page === "string" ? parseInt(page) : page;
  limit = typeof limit === "string" ? parseInt(limit) : limit;

  filteredTodos = filter({ completed, priority, search }, todos);

  const sortedTodos = sort({ sortBy, sortOrder }, filteredTodos);

  return {
    todos: sortedTodos
      ? sortedTodos.slice((page - 1) * limit, page * limit)
      : filteredTodos.slice((page - 1) * limit, page * limit),
    meta: {
      totalTodos: filteredTodos.length,
      totalPages: Math.ceil(filteredTodos.length / limit),
      page: page,
      limit: limit,
    },
  };
}

export function getTodoById(id: number): Todo | null {
  return db.getTodo(id);
}

export function createTodo(input: CreateTodoInput): Todo {
  const { text, priority, completed, dueDate } = input;

  const newTodo = {
    id: ++nextId,
    text: text.trim(),
    completed: completed ?? false,
    priority: priority ?? "low",
    ...(dueDate && { dueDate: dueDate }),
    createdAt: new Date().toISOString(),
  };

  db.addTodo(newTodo);

  return newTodo;
}

export function updateTodo(id: number, input: UpdateTodoInput): Todo | null {
  const todoIndex = db.getIndex(id);
  const todo = db.getTodo(id);
  if (todoIndex === -1) return null;

  const updatedTodo = {
    ...todo,
    ...input,
    text: input.text ? input.text.trim() : todo!.text,
    id: todo!.id,
    createdAt: todo!.createdAt,
    updatedAt: new Date().toISOString(),
  };

  db.updateTodo(todoIndex, updatedTodo as Todo);

  return updatedTodo as Todo;
}

export function deleteTodo(id: number): boolean {
  const todo = db.getTodo(id);
  if (!todo) return false;

  db.deleteTodo(id);
  return true;
}

export function getStats(): Statistics {
  const todos = db.getTodos();

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
