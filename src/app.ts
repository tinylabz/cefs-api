import "dotenv/config";
import "express-async-errors";

import express, { Express, Request, Response } from "express";

import { NotFoundError } from "./errors";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler, limiter as rateLimiter } from "./middlewares";
import { registerStudentRouter } from "./routes/auth/register-student";
import { registerStaffRouter } from "./routes/auth/register-staff";
import { studentSigninRouter } from "./routes/auth/signin-student";
import { staffSigninRouter } from "./routes/auth/signin-staff";
import { signoutRouter } from "./routes/auth/signout";
import { currentUserRouter } from "./routes/auth/me";
import { newComplaintRouter } from "./routes/complaints/new";
import { listComplaintRouter } from "./routes/complaints/list";
import { pingRouter } from "./routes/ping";

const app: Express = express();

const apiPrefixEndPoint = "/api";

app.use(rateLimiter);
app.disable("X-Powered-By");
app.use(cors());
app.use(helmet());
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(`${apiPrefixEndPoint}/auth/student/register`, registerStudentRouter);
app.use(`${apiPrefixEndPoint}/auth/staff/register`, registerStaffRouter);
app.use(`${apiPrefixEndPoint}/auth/student/signin`, studentSigninRouter);
app.use(`${apiPrefixEndPoint}/auth/staff/signin`, staffSigninRouter);
app.use(`${apiPrefixEndPoint}/auth/signout`, signoutRouter);
app.use(`${apiPrefixEndPoint}/auth/me`, currentUserRouter);
app.use(`${apiPrefixEndPoint}/complaints/new`, newComplaintRouter);
app.use(`${apiPrefixEndPoint}/complaints/list`, listComplaintRouter);
app.use(`${apiPrefixEndPoint}/ping`, pingRouter);

app.all("*", async (_req: Request, res: Response) => {
  const error = new NotFoundError("Route not Found");
  return res.status(error.statusCode).send(error.serializeErrors());
});

app.use(errorHandler);
export { app };
