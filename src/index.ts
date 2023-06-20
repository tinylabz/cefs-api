import { app } from "./app";
import mongoose from "mongoose";
import { __PROD__ } from "./config/__prod__";
import { debug } from "./utils/debug";
import axios from "axios";

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
    .connect(__PROD__ ? process.env.MONGO_URI : "mongodb://127.0.0.1:27017/db1")
    .then(({ connection: { name } }) => debug("Connected to Database: ", name))
    .catch((err) => {
      debug((err as Error).message);
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

function makeRequest() {
  axios
    .get("https://dont-go-to-bed.onrender.com/ping")
    .then((response) => {
      console.log("Response:", response.data);
    })
    .catch((error) => {
      console.error("Error:", error.message);
    });
}

setInterval(makeRequest, 60000);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => debug(`Server running on port: ${PORT}`));
