import multer from "multer";
import { Request, Response, Router } from "express";
import { requireAuth } from "../middlewares";

const router = Router().get("/", async (req: Request, res: Response) => {
  return res.status(200).send({ file: req.file, text: req.body });
});

router.post(
  "/marks",
  requireAuth,
  multer({
    storage: multer.diskStorage({
      destination: (_req, _file, callback) => callback(null, `public/marks`),
      filename: (req, file, callback) => {
        callback(null, `${req.user?._id}-${file.originalname}`);
      },
    }),
  }).single("file"),
  (req, res, _next) => {
    return res.status(200).send({ file: req.file, text: req.body });
  }
);

router.post(
  "/reciept",
  requireAuth,
  multer({
    storage: multer.diskStorage({
      destination: (_req, _file, callback) => callback(null, `public/reciepts`),
      filename: (req, file, callback) => {
        callback(null, `${req.user?._id}-${file.originalname}`);
      },
    }),
  }).single("file"),
  (req, res, _next) => {
    return res.status(200).send({ file: req.file, text: req.body });
  }
);

router.post(
  "/test-attendence",
  requireAuth,
  multer({
    storage: multer.diskStorage({
      destination: (_req, _file, callback) =>
        callback(null, `public/attendence/test`),
      filename: (req, file, callback) => {
        callback(null, `${req.user?._id}-${file.originalname}`);
      },
    }),
  }).single("file"),
  (req, res, _next) => {
    return res.status(200).send({ file: req.file, text: req.body });
  }
);

router.post(
  "/exam-attendence",
  requireAuth,
  multer({
    storage: multer.diskStorage({
      destination: (_req, _file, callback) =>
        callback(null, `public/attendence/exam`),
      filename: (req, file, callback) => {
        callback(null, `${req.user?._id}-${file.originalname}`);
      },
    }),
  }).single("file"),
  (req, res, _next) => {
    return res.status(200).send({ file: req.file, text: req.body });
  }
);

export { router as uploadRouter };
