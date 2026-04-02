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
import { CustomError } from "@/utils/error.js";

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
    const result = await getTodos(req.query);

    if ("error" in result) {
      throw new Error((result as { error: string }).error);
    }

    return res.json({
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
    });
  } catch (error) {
    next(error);
  }
}

export async function getById(
  req: Request<{ id: string }>,
  res: Response<ApiResponse<Todo | { error: string }>>,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    const result = await getTodoById(id);

    if (!result) {
      throw new CustomError("Todo was not found", 404, "NotFoundError");
    }

    if ("error" in result) {
      throw new Error((result as { error: string }).error);
    }

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function create(
  req: Request,
  res: Response<ApiResponse<Todo | { error: string }>>,
  next: NextFunction,
) {
  try {
    const result = await createTodo(req.body);

    if ("error" in result) {
      throw new Error((result as { error: string }).error);
    }

    return res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function update(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;

    if (!Object.keys(req.body).length) {
      throw new CustomError("No fields were provided", 400, "BadRequestError");
    }

    const result = await updateTodo(id, req.body);

    if (!result) {
      throw new CustomError("Todo was not found", 404, "NotFoundError");
    }

    if ("error" in result) {
      throw new Error((result as { error: string }).error);
    }

    return res.json({
      success: true,
      data: result,
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

    const result = await deleteTodo(id);

    if (!result) {
      throw new CustomError("Todo was not found", 404, "NotFoundError");
    }

    if (typeof result === "object" && "error" in result) {
      throw new Error((result as { error: string }).error);
    }

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
    const result = await getStats();

    if ("error" in result) {
      throw new CustomError(result.error, 500, "InternalServerError");
    }

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
