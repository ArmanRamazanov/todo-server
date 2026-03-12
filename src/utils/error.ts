export class CustomError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number, name: string) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
  }
}
