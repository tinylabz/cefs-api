import { NextFunction, Request, Response } from "express";

import { BadRequestError } from "../errors";
import mongoose from "mongoose";

const validateObjectID = (req: Request, res: Response, next: NextFunction) => {
  if (!req.params.id || !mongoose.isValidObjectId(req.params.id))
    return next(new BadRequestError("Invalid objectId").message);

  next();
};
export { validateObjectID };
