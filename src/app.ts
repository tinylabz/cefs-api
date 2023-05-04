import "dotenv/config";
import "express-async-errors";

import express, { Express, Request, Response } from "express";

import { NotFoundError } from "./errors";
import cors from "cors";
import { currentUserRouter } from "./routes/auth/current-user";
import { errorHandler } from "./middlewares/error-handler";
import helmet from "helmet";
import morgan from "morgan";
import { pingRouter } from "./routes/ping";
import { limiter as rateLimiter } from "./middlewares";
import { signinRouter } from "./routes/auth/signin";
import { signoutRouter } from "./routes/auth/signout";
import { signupRouter } from "./routes/auth/signup";

const app: Express = express();

const apiPrefixEndPoint = "/api";

app.use(rateLimiter);
app.set("trust proxy", true);
app.disable("X-Powered-By");
app.use(cors());
app.use(helmet());
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(`${apiPrefixEndPoint}/auth/signup`, signupRouter);
app.use(`${apiPrefixEndPoint}/auth/signin`, signinRouter);
app.use(`${apiPrefixEndPoint}/auth/current-user`, currentUserRouter);
app.use(`${apiPrefixEndPoint}/auth/signout`, signoutRouter);
app.use(`${apiPrefixEndPoint}/ping`, pingRouter);

app.all("*", async (req: Request, res: Response) => {
  const error = new NotFoundError("Route to resource not Found");
  return res.status(error.statusCode).send(error.serializeErrors());
});

app.use(errorHandler);
export { app };
