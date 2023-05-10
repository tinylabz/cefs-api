import { CustomError, ErrorField } from "./custom-error";

export class UnauthorizedError extends CustomError {
  statusCode = 401;

  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }

  serializeErrors(): ErrorField {
    return { message: this.message };
  }
}
