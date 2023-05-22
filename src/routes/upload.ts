import multer from "multer";
import { Request, Response, Router } from "express";
import { requireAuth } from "../middlewares";

const router = Router().get("/", async (req: Request, res: Response) => {
  return res.status(200).send({ file: req.file, text: req.body });
});

router.post(
  "/",
  requireAuth,
  multer({
    storage: multer.diskStorage({
      destination: (_req, _file, callback) => callback(null, `public`),
      filename: (req, file, callback) => {
        callback(null, `${req.user?._id}-${file.originalname}`);
      },
    }),
  }).single("document"),
  (req, res, _next) => {
    return res.status(200).send({ file: req.file, text: req.body });
  }
);

export { router as uploadRouter };
