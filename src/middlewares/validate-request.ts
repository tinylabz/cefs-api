import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return errors.array()[1].msg
      ? res.status(400).send(`${errors.array()[1].msg}`)
      : res.status(400).send("Some Fields are missing!");
  }

  next();
};
