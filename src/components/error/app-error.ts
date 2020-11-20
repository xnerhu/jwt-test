export class AppError extends Error {
  constructor(
    public readonly message: any,
    public readonly statusCode?: number,
    public readonly operational = true,
  ) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}
