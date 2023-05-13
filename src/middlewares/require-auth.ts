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
  const authHeader = req.headers["authorization"];

  const error = new UnauthorizedError("Unauthorized!");

  if (!authHeader) {
    return res.status(error.statusCode).send({ error: error.message });
  }

  const [bearer, token] = authHeader.split(" ");

  if (bearer !== "Bearer" || !token) {
    return res.status(error.statusCode).send({ error: error.message });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY!) as UserPayload;
    req.user = decoded;
    debug("AUTHORISED");
    return next();
  } catch (err) {
    debug("NOT AUTHORISED");
    const error = new UnauthorizedError((err as Error).message);
    return res.status(error.statusCode).send({ error: error.message });
  }
};
