import express, { Response, Request } from "express";
import { Review } from "../models/Review";
import { validateRequest } from "../middlewares";
import { body } from "express-validator";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({});
    return res.send({ reviews });
  } catch (error) {
    return res.status(500).send((error as Error).message);
  }
});

router.post(
  "/",
  [
    body("user").isString().notEmpty().withMessage("user is required"),
    body("value").isNumeric().notEmpty().withMessage("You must supply a value"),
    body("description")
      .isString()
      .notEmpty()
      .withMessage("You must supply a description"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { user, value, description } = req.body;
    try {
      const review = await Review.create({
        description,
        value,
        user,
      });
      return res.send({ review });
    } catch (error) {
      return res.status(500).send((error as Error).message);
    }
  }
);

export { router as reivewsRouter };
