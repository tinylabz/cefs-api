import multer from "multer";
import { Request, Response, Router } from "express";
import { requireAuth } from "../middlewares";
import { debug } from "../utils/debug";

const router = Router().get("/", async (req: Request, res: Response) => {
  return res.status(200).send({ file: req.file, text: req.body });
});

router.post(
  "/profile",
  requireAuth,
  multer({
    storage: multer.diskStorage({
      destination: (req, file, callback) =>
        callback(null, `public/${req.user?._id}`),
      filename: (_req, file, callback) => {
        callback(null, file.originalname);
      },
    }),
  }).single("avatar"),
  (req, res, _next) => {
    debug("HERE");
    return res.status(200).send({ file: req.file, text: req.body });
  }
);

export { router as uploadRouter };
