import "dotenv/config";

import express, { Express, Request, Response } from "express";

import { NotFoundError } from "./errors";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler, limiter as rateLimiter } from "./middlewares";
import { signoutRouter } from "./routes/auth/signout";
import { currentUserRouter } from "./routes/auth/me";
import { complaintsRouter } from "./routes/complaints";
import { pingRouter } from "./routes/ping";
import { errorRouter } from "./routes/500";
import { uploadRouter } from "./routes/upload";
import { staffRouter } from "./routes/staff";
import { studentRouter } from "./routes/student";
import { mailRouter } from "./routes/mail";
import { passwordChangeRouter } from "./routes/auth/password";
import { verifyEmailRouter } from "./routes/auth/verify-email";

const app: Express = express();

const apiPrfxEP = "/api";
app.use(rateLimiter);
app.disable("X-Powered-By");
app.use(cors());
app.use(helmet());
app.use(morgan("combined"));
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use(`${apiPrfxEP}/change-password`, passwordChangeRouter);
app.use(`${apiPrfxEP}/verify-email`, verifyEmailRouter);
app.use(`${apiPrfxEP}/complaints`, complaintsRouter);
app.use(`${apiPrfxEP}/students/`, studentRouter);
app.use(`${apiPrfxEP}/signout`, signoutRouter);
app.use(`${apiPrfxEP}/me`, currentUserRouter);
app.use(`${apiPrfxEP}/upload`, uploadRouter);
app.use(`${apiPrfxEP}/staff/`, staffRouter);
app.use(`${apiPrfxEP}/error`, errorRouter);
app.use(`${apiPrfxEP}/ping`, pingRouter);
app.use(`${apiPrfxEP}/mail`, mailRouter);

app.all("*", async (_req: Request, res: Response) => {
  const error = new NotFoundError("Route not Found");
  return res.status(error.statusCode).send(error.message);
});

app.use(errorHandler);
export { app };
