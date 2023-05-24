import express, { Request, Response } from "express";
import { debug } from "../utils/debug";
import path from "path";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const fileName = req.params.fileName;
  debug("FILENAME:", fileName);
  const filePath = path.join(
    __dirname,
    "marks/64676bfc76ede5e2f831806b-image006.png"
  ); // Replace with the path to your file

  res.download(filePath, "name", (err) => {
    if (err) {
      // Handle error, e.g., file not found or access denied
      console.error(err);
      res.status(404).send("File not found");
    }
  });
});

export { router as fileRouter };
