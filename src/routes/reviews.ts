import express, { Response, Request } from "express";
import { Review } from "../models/Review";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({});
    return res.status(200).send({ reviews });
  } catch (error) {
    return res.status(500).send((error as Error).message);
  }
});

router.post("/", async (req: Request, res: Response) => {
  const { user, value, description } = req.body;
  try {
    const review = await Review.create({
      description,
      value,
      user,
    });
    return res.status(200).send({ review });
  } catch (error) {
    return res.status(500).send((error as Error).message);
  }
});

export { router as reivewsRouter };
