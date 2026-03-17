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
  dueDate?: string;
  updatedAt?: string;
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
  completed?: string | undefined;
  priority?: string | undefined;
  search?: string | undefined;
  sortBy?: "dueDate" | "createdAt" | undefined;
  sortOrder?: string;
}

export type CreateTodoInput = Omit<Todo, "id" | "createdAt" | "updatedAt"> & {
  completed?: boolean;
};

export type FilterQuery = Omit<
  PaginationQuery,
  "sortBy" | "sortOrder" | "page" | "limit"
>;

export type SortQuery = Pick<PaginationQuery, "sortBy" | "sortOrder">;

export type UpdateTodoInput = Partial<
  Omit<Todo, "id" | "createdAt" | "updatedAt">
>;

export type todoWithDueDate = Omit<Todo, "dueDate"> & { dueDate: string };
