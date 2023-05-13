import { NextFunction, Request, Response } from "express";

import { CustomError } from "../errors/error";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    next(err.message);
  } else {
    return res.status(500).send({ error: "Something went wrong." });
  }
};
