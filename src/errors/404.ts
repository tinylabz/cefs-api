import { CustomError, ErrorField } from "./error";

export class NotFoundError extends CustomError {
  statusCode = 404;
  constructor(public message: string) {
    super(message || "Not found");

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors(): ErrorField {
    return { message: this.message || "Not found" };
  }
}
