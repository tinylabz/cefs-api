import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { DESIGNATIONS, UserPayload } from "../Interfaces";

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
  const header = req.headers["authorization"];

  if (!header) return res.status(401).send("Missing Auth headers!");

  const [bearer, token] = header.split(" ");

  if (bearer !== "Bearer" || !token) {
    return res.status(401).send("Missing or Invalid token!");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY!) as UserPayload;
    req.user = decoded;

    return next();
  } catch (err) {
    return res.status(401).send((err as Error).message);
  }
};

export const IsHod = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.designation !== DESIGNATIONS.HOD)
    return res.status(403).send("This route is only accessible to HOD's");

  next();
};

export const IsLecturer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.designation !== DESIGNATIONS.LECTURER)
    return res.status(403).send(`This route is only accessible to lecturers`);

  next();
};

export const isRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.designation !== DESIGNATIONS.REGISTRAR)
    return res.status(403).send(`This route is only accessible to registrars`);

  next();
};
