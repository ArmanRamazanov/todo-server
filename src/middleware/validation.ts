import type {
  PaginationQuery,
  CreateTodoInput,
  UpdateTodoInput,
} from "@/types/todo.types.js";

import type { Request, Response } from "express";

import { isValid } from "@/utils/helperFunctions/validateDate.js";

import mongoose from "mongoose";

export function validateAndHandle(validators: {
  create?: (input: any) => string[];
  update?: (input: any) => string[];
  todoQuery?: (input: any) => string[];
  todoId?: (input: any) => string[];
}): (req: Request, res: Response, next: () => void) => void {
  return function (req: Request, res: Response, next: () => void) {
    const errors: string[] = [];
    const { create, update, todoQuery, todoId } = validators;
    if (todoQuery) {
      const result = todoQuery(req.query);
      errors.push(...result);
    }

    if (create) {
      const result = create(req.body);
      errors.push(...result);
    }

    if (update) {
      const result = update(req.body);
      errors.push(...result);
    }

    if (todoId) {
      const result = todoId(req.params.id);
      errors.push(...result);
    }

    if (errors.length) {
      return res.status(400).json({
        success: false,
        error: "Validation Error",
        details: errors,
      });
    }

    next();
  };
}

export function validateTodoQuery(query: PaginationQuery): string[] {
  const { page, limit, completed, priority, search } = query;
  const errors: string[] = [];

  if (page && (Number.isNaN(parseInt(page)) || parseInt(page) <= 0)) {
    errors.push("The page must be a positive integer and bigger than 0");
  }
  if (limit && (Number.isNaN(parseInt(limit)) || parseInt(limit) <= 0)) {
    errors.push("The limit must be a positive integer and bigger than 0");
  }
  if (completed && completed !== "true" && completed !== "false") {
    errors.push("The completed must be either true or false");
  }
  if (
    priority &&
    priority !== "low" &&
    priority !== "medium" &&
    priority !== "high"
  ) {
    errors.push("The priority must be either low, medium or high");
  }
  if (search && !search.trim().length) {
    errors.push("The search cannot be an empty string");
  }

  return errors;
}

export function validateCreateTodo(input: CreateTodoInput): string[] {
  const { text, priority, completed, dueDate } = input;
  const errors: string[] = [];

  if (typeof text !== "string") {
    errors.push("The text must be a string");
    return errors;
  }

  if (text === undefined || !text.trim().length) {
    errors.push("The text is required");
  }

  if (dueDate) {
    const dueDateResult = isValid(dueDate);

    if (dueDateResult) {
      errors.push(dueDateResult);
    }
  }

  if (
    priority !== undefined &&
    priority !== "low" &&
    priority !== "medium" &&
    priority !== "high"
  ) {
    errors.push("The priority must be either low, medium or high");
  }
  if (completed !== undefined && typeof completed !== "boolean") {
    errors.push("The completed must be boolean");
  }
  return errors;
}

export function validateUpdateTodo(input: UpdateTodoInput): string[] {
  const { text, priority, completed, dueDate } = input;
  const errors: string[] = [];

  if (text !== undefined && !text.trim().length) {
    errors.push("The text cannot be empty");
  }

  if (dueDate) {
    const dueDateResult = isValid(dueDate);

    if (dueDateResult) {
      errors.push(dueDateResult);
    }
  }

  if (
    priority !== undefined &&
    priority !== "low" &&
    priority !== "medium" &&
    priority !== "high"
  ) {
    errors.push("The priority must be either low, medium or high");
  }
  if (completed !== undefined && typeof completed !== "boolean") {
    errors.push("The completed must be either true or false");
  }
  return errors;
}

export function validateTodoId(id: any): string[] {
  const errors: string[] = [];
  if (!mongoose.Types.ObjectId.isValid(id)) {
    errors.push("The todo ID is invalid");
  }
  return errors;
}
