import type { Request, Response, NextFunction } from "express";
import type { ApiResponse } from "@/types/index.js";
import type { Todo, Statistics } from "@/types/Todo.types.js";

import {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  getStats,
} from "../services/todoService.js";
import { CustomError } from "../utils/error.js";

export async function getAll(
  req: Request,
  res: Response<
    ApiResponse<{
      todos: Todo[];
      meta: {
        totalTodos: number;
        totalPages?: number;
        page: number;
        limit?: number;
      };
    }>
  >,
  next: NextFunction,
) {
  try {
    const result = await getTodos(req.query, req.userId);

    res.json({
      success: true,
      data: result as {
        todos: Todo[];
        meta: {
          totalTodos: number;
          totalPages?: number;
          page: number;
          limit?: number;
        };
      },
      message: null,
    });
  } catch (error) {
    next(error);
  }
}

export async function getById(
  req: Request<{ id: string }>,
  res: Response<ApiResponse<Todo>>,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    const result = await getTodoById(id, req.userId);

    res.json({
      success: true,
      data: result,
      message: null,
    });
  } catch (error) {
    next(error);
  }
}

export async function create(
  req: Request,
  res: Response<ApiResponse<Todo>>,
  next: NextFunction,
) {
  try {
    const result = await createTodo(req.body, req.userId);

    res.status(201).json({
      success: true,
      data: result,
      message: null,
    });
  } catch (error) {
    next(error);
  }
}

export async function update(
  req: Request<{ id: string }>,
  res: Response<ApiResponse<Todo>>,
  next: NextFunction,
) {
  try {
    const { id } = req.params;

    const result = await updateTodo(id, req.body, req.userId);

    res.json({
      success: true,
      data: result,
      message: null,
    });
  } catch (error) {
    next(error);
  }
}

export async function del(
  req: Request<{ id: string }>,
  res: Response<ApiResponse<null>>,
  next: NextFunction,
) {
  try {
    const { id } = req.params;

    const result = await deleteTodo(id, req.userId);

    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

export async function getStatistics(
  req: Request,
  res: Response<ApiResponse<Statistics>>,
  next: NextFunction,
) {
  try {
    const result = await getStats(req.userId);

    res.json({
      success: true,
      data: result,
      message: null,
    });
  } catch (error) {
    next(error);
  }
}
