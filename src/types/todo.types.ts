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
  _id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  createdAt: Date;
  dueDate?: Date;
  updatedAt?: Date;
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
  completed?: string;
  priority?: string;
  search?: String;
  sortBy?: "dueDate" | "createdAt" | undefined;
  sortOrder?: string;
}

export type CreateTodoInput = Omit<
  Todo,
  "_id" | "createdAt" | "updatedAt" | "dueDate"
> & {
  dueDate?: string;
};

export type FilterQuery = Omit<
  PaginationQuery,
  "sortBy" | "sortOrder" | "page" | "limit" | "completed"
> & {
  completed?: boolean;
};

export type SortQuery = Pick<PaginationQuery, "sortBy" | "sortOrder">;

export type UpdateTodoInput = Partial<
  Omit<Todo, "id" | "createdAt" | "updatedAt" | "dueDate"> & {
    dueDate?: string;
  }
>;

export type todoWithDueDate = Omit<Todo, "dueDate"> & { dueDate: string };
