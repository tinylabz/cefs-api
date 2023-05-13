import { CustomError, ErrorField } from "./error";

export class InternalServerError extends CustomError {
  statusCode = 500;

  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}

export class DBConnError extends CustomError {
  statusCode = 500;

  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, DBConnError.prototype);
  }
}
