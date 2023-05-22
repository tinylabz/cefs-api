import { ValidationError } from "express-validator";
import { CustomError } from "./error";

export class BadRequestError extends CustomError {
  statusCode = 400;
  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

export class ReqValidationError extends CustomError {
  statusCode = 400;

  constructor(private errors: ValidationError[]) {
    super("Invalid Request Parameters");

    Object.setPrototypeOf(this, ReqValidationError.prototype);
  }
}
