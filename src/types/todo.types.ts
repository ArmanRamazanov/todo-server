export enum Priority {
  Low = "low",
  Medium = "medium",
  High = "high",
}

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: Error;
  message?: string;
};

export interface Statistics {
  total: number;
  completed: number;
  pending: number;
  byPriority: Record<Priority, number>;
}

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  priority: Priority;
  createdAt: string;
  updatedAt?: string;
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
  completed?: string;
  priority?: string;
  search?: string;
}

export type CreateTodoInput = Omit<Todo, "id" | "createdAt" | "updatedAt"> & {
  completed?: boolean;
};

export type UpdateTodoInput = Partial<
  Omit<Todo, "id" | "createdAt" | "updatedAt">
>;
