import { CustomError, ErrorField } from "./custom-error";

import { ValidationError } from "express-validator";

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
