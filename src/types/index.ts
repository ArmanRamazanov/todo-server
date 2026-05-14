export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message: string | null;
};

declare global {
  namespace Express {
    interface Request {
      userId: string;
      role: string;
    }
  }
}
