import type { Request, Response, NextFunction } from "express";
import type { ApiResponse, Todo, Statistics } from "@/types/todo.types.js";
import {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  getStats,
} from "@/services/todoService.js";
import { CustomError } from "../utils/error.js";

export function getAll(
  req: Request,
  res: Response<ApiResponse<Todo[]>>,
  next: NextFunction,
) {
  try {
    const result = getTodos(req.query);
    return res.json({
      success: true,
      data: result.todos,
    });
  } catch (error) {
    next(error);
  }
}

export function getById(
  req: Request<{ id: string }>,
  res: Response<ApiResponse<Todo>>,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    const result = getTodoById(parseInt(id));

    if (!result) {
      throw new CustomError("Todo was not found", 404, "NotFoundError");
    }

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export function create(
  req: Request,
  res: Response<ApiResponse<Todo>>,
  next: NextFunction,
) {
  try {
    const result = createTodo(req.body);
    return res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export function update(
  req: Request<{ id: string }>,
  res: Response<ApiResponse<Todo>>,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    const { text, completed, priority } = req.body;

    if (!text || !text.trim().length || completed === undefined || !priority) {
      throw new CustomError(
        "You have not provided all 3 fields",
        400,
        "BadRequestError",
      );
    }

    const result = updateTodo(parseInt(id), req.body);

    if (!result) {
      throw new CustomError("Todo was not found", 404, "NotFoundError");
    }

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export function patch(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;

    if (!Object.keys(req.body).length) {
      throw new CustomError("No fields were provided", 400, "BadRequestError");
    }

    const result = updateTodo(parseInt(id), req.body);

    if (!result) {
      throw new CustomError("Todo was not found", 404, "NotFoundError");
    }

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export function del(
  req: Request<{ id: string }>,
  res: Response<ApiResponse<null>>,
  next: NextFunction,
) {
  try {
    const { id } = req.params;

    const result = deleteTodo(parseInt(id));

    if (!result) {
      throw new CustomError("Todo was not found", 404, "NotFoundError");
    }

    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

export function getStatistics(
  req: Request,
  res: Response<ApiResponse<Statistics>>,
  next: NextFunction,
) {
  try {
    const result = getStats();
    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export function health(req: Request, res: Response, next: NextFunction) {
  try {
    res.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  } catch (error) {
    next(error);
  }
}
