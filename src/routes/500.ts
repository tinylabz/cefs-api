import { Request, Response, Router } from "express";
import { InternalServerError } from "../errors";

const router = Router().get("/", async (req: Request, res: Response) => {
  try {
    throw new InternalServerError("Intended Exception");
  } catch (error: unknown) {
    res.status(500).send({ error: (error as Error).message });
  }
});

export { router as errorRouter };
