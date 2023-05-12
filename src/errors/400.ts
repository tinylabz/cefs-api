import { ValidationError } from "express-validator";
import { CustomError, ErrorField } from "./error";

export class BadRequestError extends CustomError {
  statusCode = 400;
  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors(): ErrorField {
    return { message: this.message };
  }
}

export class ReqValidationError extends CustomError {
  statusCode = 400;

  constructor(private errors: ValidationError[]) {
    super("Invalid Request Parameters");

    Object.setPrototypeOf(this, ReqValidationError.prototype);
  }

  serializeErrors(): ErrorField[] {
    return this.errors.map((error) => {
      return { message: error.msg, field: error.param };
    });
  }
}
