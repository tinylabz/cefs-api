import { Request, Response, NextFunction } from "express";
import { ReqValidationError } from "../errors";
import { validationResult } from "express-validator";

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new ReqValidationError(errors.array());
  }

  next();
};
