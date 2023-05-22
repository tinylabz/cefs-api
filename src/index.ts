import { app } from "./app";
import mongoose from "mongoose";
import { __PROD__ } from "./config/__prod__";
import { debug } from "./utils/debug";
import { DBConnError } from "./errors";

const start = async (): Promise<void | never> => {
  if (!process.env.JWT_KEY) {
    debug("JWT_KEY must be defined!");
    process.exit(1);
  }
  if (!process.env.MONGO_URI) {
    debug("MONGO_URI must be defined!");
    process.exit(1);
  }

  mongoose
    .connect(
      __PROD__ ? process.env.MONGO_URI : "mongodb://127.0.0.1:27017/cefs2"
    )
    .then(({ connection: { name } }) => debug("Connected to Database: ", name))
    .catch((err) => {
      const dbErr = new DBConnError((err as Error).message);
      debug(dbErr.message);
    });
};

start();

process.on("uncaughtException", (err) => {
  debug(err);
});
process.on("unhandledRejection", (err) => {
  debug(err);
});
process.on("uncaughtExceptionMonitor", (err) => {
  debug(err);
});

process.on("SIGINT", () => {
  debug("Shutting down");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => debug(`Server running on port: ${PORT}`));
