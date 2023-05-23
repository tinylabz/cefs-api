import express, { Request, Response } from "express";
import multer from "multer";
import {
  parser,
  searchAttendenceSheet,
  searchMarkSheet,
} from "../services/xls-parser";
import { debug } from "../utils/debug";
import { requireAuth } from "../middlewares";

const router = express.Router();

router.post(
  "/",
  requireAuth,
  multer({
    storage: multer.diskStorage({
      destination: (req, file, callback) => callback(null, `public`),
      filename: (req, file, callback) => {
        callback(null, `${req.user?._id}-${file.originalname}`);
      },
    }),
  }).single("document"),
  async (req: Request, res: Response) => {
    const filePath = req.file?.path;
    debug(filePath);
    if (!filePath) return res.status(400).send("No file path detected");

    try {
      const json = parser(filePath);
      // debug(json);

      const result = searchMarkSheet(json, 1900700215);
      if (!result)
        return res
          .status(404)
          .send(
            `No results for student ${req.user?.name} in the specified course unit. This mean that the student never sat for any of the C/W, tests or final exam`
          );
      res.status(200).send(result);
    } catch (error) {
      console.error("Error parsing the file:", error);
      res.status(500).send("Error parsing the file.");
    }
  }
);

router.post(
  "/",
  requireAuth,
  multer({
    storage: multer.diskStorage({
      destination: (req, file, callback) => callback(null, `public`),
      filename: (req, file, callback) => {
        callback(null, `${req.user?._id}-${file.originalname}`);
      },
    }),
  }).single("document"),
  async (req: Request, res: Response) => {
    const filePath = req.file?.path;
    debug(filePath);
    if (!filePath) return res.status(400).send("No file path detected");

    try {
      const json = parser(filePath);
      // debug(json);

      const result = searchAttendenceSheet(json, 1900700215);
      if (!result)
        return res
          .status(404)
          .send("No attendence record for specified student!");
      return res.status(200).send(result);
    } catch (error) {
      console.error("Error parsing the file:", error);
      return res.status(500).send("Error parsing the file.");
    }
  }
);

export { router as xlsxRouter };
