import { NextFunction, Request, Response } from "express";

import { CustomError } from "../errors/error";
import { debug } from "../utils/debug";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    next(err.message);
  } else {
    debug(err);
    return res.status(500).send(err.message);
  }
};
