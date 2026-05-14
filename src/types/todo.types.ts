export enum Priority {
  Low = "low",
  Medium = "medium",
  High = "high",
}

export interface Statistics {
  total: number;
  completed: number;
  pending: number;
  byPriority: Record<Priority, number>;
}

export interface Todo {
  userId: string;
  text: string;
  completed: boolean;
  priority: Priority;
  dueDate: Date | null;
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
  completed?: string;
  priority?: string;
  search?: string;
  sortBy?: "dueDate" | "createdAt";
  sortOrder?: string;
}

export type CreateTodoInput = Omit<
  Todo,
  "_id" | "createdAt" | "updatedAt" | "dueDate" | "completed"
> & {
  dueDate?: string;
  completed?: boolean;
};

export type FilterQuery = Omit<
  PaginationQuery,
  "sortBy" | "sortOrder" | "page" | "limit" | "completed"
> & {
  completed?: boolean;
};

export type SortQuery = Pick<PaginationQuery, "sortBy" | "sortOrder">;

export type UpdateTodoInput = Partial<
  Omit<Todo, "_id" | "createdAt" | "updatedAt" | "userId"> & {
    dueDate?: string;
  }
>;

// export type todoWithDueDate = Omit<Todo, "dueDate"> & { dueDate: string };
