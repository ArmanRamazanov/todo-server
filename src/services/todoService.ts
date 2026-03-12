import type {
  Todo,
  PaginationQuery,
  CreateTodoInput,
  UpdateTodoInput,
  Statistics,
} from "@/types/todo.types.ts";

let todos: Todo[] = [];
let nextId = 1;

export function getTodos(options: PaginationQuery): {
  todos: Todo[];
  meta: {
    totalTodos: number;
    totalPages?: number;
    page: number;
    limit?: number;
  };
} {
  let { page = 1, limit = 10, completed, priority, search } = options;
  let filteredTodos: Todo[] = [];

  page = typeof page === "string" ? parseInt(page) : page;
  limit = typeof limit === "string" ? parseInt(limit) : limit;

  console.log(completed);
  console.log(priority);
  console.log(search);
  console.log(options);
  filteredTodos = todos.filter((todo) => {
    const completedMatch = !completed || String(todo.completed) === completed;
    const priorityMatch = !priority || todo.priority === priority;
    const searchMatch = !search || todo.text.includes(search);

    return completedMatch && priorityMatch && searchMatch;
  });

  return {
    todos: filteredTodos.slice((page - 1) * limit, page * limit),
    meta: {
      totalTodos: todos.length,
      totalPages: Math.ceil(todos.length / limit),
      page: page,
      limit: limit,
    },
  };
}

export function getTodoById(id: number): Todo | null {
  return todos.find((todo) => todo.id === id) ?? null;
}

export function createTodo(input: CreateTodoInput): Todo {
  const { text, priority, completed } = input;

  const newTodo = {
    id: nextId++,
    text: text,
    completed: completed ?? false,
    priority: priority ?? "low",
    createdAt: new Date().toISOString(),
  };

  todos.push(newTodo);

  return newTodo;
}

export function updateTodo(id: number, input: UpdateTodoInput): Todo | null {
  const todoIndex = todos.findIndex((todo) => todo.id === id);
  console.log(todoIndex);
  if (todoIndex === -1) return null;

  todos[todoIndex] = {
    ...todos[todoIndex]!,
    ...input,
    id: todos[todoIndex]!.id,
    createdAt: todos[todoIndex]!.createdAt,
    updatedAt: new Date().toISOString(),
  };
  return todos[todoIndex];
}

export function deleteTodo(id: number): boolean {
  const todo = todos.find((todo) => todo.id === id);

  if (!todo) return false;

  todos = todos.filter((todo) => todo.id !== id);
  return true;
}

export function getStats(): Statistics {
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
