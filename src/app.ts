import "dotenv/config";

import express, { Express, Request, Response } from "express";
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
import { reivewsRouter } from "./routes/reviews";
import { xlsRouter } from "./routes/xls";
import { reportRouter } from "./routes/report";

const app: Express = express();

const prefix = "/api";
app.use(rateLimiter);
app.disable("X-Powered-By");
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use(`${prefix}/change-password`, passwordChangeRouter);
app.use(`${prefix}/verify-email`, verifyEmailRouter);
app.use(`${prefix}/complaints`, complaintsRouter);
app.use(`${prefix}/reviews`, reivewsRouter);
app.use(`${prefix}/students`, studentRouter);
app.use(`${prefix}/signout`, signoutRouter);
app.use(`${prefix}/me`, currentUserRouter);
app.use(`${prefix}/report`, reportRouter);
app.use(`${prefix}/upload`, uploadRouter);
app.use(`${prefix}/staff`, staffRouter);
app.use(`${prefix}/error`, errorRouter);
app.use(`${prefix}/ping`, pingRouter);
app.use(`${prefix}/mail`, mailRouter);
app.use(`${prefix}/parse`, xlsRouter);

app.all("*", async (_req: Request, res: Response) => {
  return res.status(404).send("Route Not found!");
});

app.use(errorHandler);
export { app };
