import mongoose from "mongoose";
import jwt from "jsonwebtoken";

function isMongoDuplicateError(
  error: any,
): error is { code: number; keyValue: Record<string, unknown> } {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "keyValue" in error &&
    (error as { code: unknown }).code === 11000
  );
}

export function serverErrorHandler(error: unknown) {
  if (error instanceof mongoose.Error.ValidationError) {
    const details = Object.values(error.errors).map((err) => ({
      field: err.path,
      message: err.message,
    }));

    return { status: 400, details };
  }

  if (isMongoDuplicateError(error)) {
    const field = Object.keys(error.keyValue)[0];
    const details = {
      field,
      message: `This ${field} is already taken`,
    };

    return { status: 409, details };
  }

  if (
    (error as { name: string }).name === "TokenExpiredError" ||
    (error as { name: string }).name === "JsonWebTokenError"
  ) {
    return {
      status: 400,
      message: "Invalid or expired token",
    };
  }

  if ((error as { isManual: boolean }).isManual) {
    const { status, message, field } = error as {
      status: number;
      message: string;
      field: string;
    };

    console.log(error);

    if (field) {
      return { status, details: { field, message } };
    }
    return { status, message };
  }

  if (error instanceof jwt.JsonWebTokenError) {
    return { status: 401, message: "The token is invalid" };
  }

  if (error instanceof jwt.TokenExpiredError) {
    return { status: 403, message: "The token is no longer valid" };
  }

  return { status: 500, message: (error as { stack: string }).stack };
}
