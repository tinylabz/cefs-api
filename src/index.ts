import { app } from "./app";
import mongoose from "mongoose";
import { __PROD__ } from "./config/__prod__";

const start = async function (): Promise<void> | never {
  if (!process.env.JWT_KEY) {
    console.error("JWT_KEY must be defined!");
    process.exit(1);
  }
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI must be defined!");
    process.exit(1);
  }

  mongoose
    .connect(
      __PROD__ ? process.env.MONGO_URI : "mongodb://127.0.0.1:27017/cefs1"
    )
    .then(() => console.log("Connected to Database!"))
    .catch((err) => console.log(err));
};

start();

process.on("uncaughtException", (err) => {
  throw new Error((err as Error).message);
});
process.on("unhandledRejection", (err) => {
  throw new Error((err as Error).message);
});
process.on("uncaughtExceptionMonitor", (err) => {
  throw new Error((err as Error).message);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
