import { NextFunction, Request, Response } from "express";

import { UnauthorizedError } from "../errors";
import jwt from "jsonwebtoken";
import { UserPayload } from "../Interfaces";
import { debug } from "../utils/debug";

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(401)
      .send({ message: new UnauthorizedError("Not authorized") });
  }

  const [bearer, token] = authHeader.split(" ");

  if (bearer !== "Bearer" || !token) {
    return res
      .status(401)
      .send({ message: new UnauthorizedError("Not authorized") });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_KEY!) as UserPayload;
    req.user = payload;
    debug("AUTHORISED");
    return next();
  } catch (err) {
    debug("NOT AUTHORISED");
    return res
      .status(401)
      .send({ message: new UnauthorizedError("Not authorized") });
  }
};
