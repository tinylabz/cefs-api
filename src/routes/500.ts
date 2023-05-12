import { Request, Response, Router } from "express";

const router = Router().get("/", async (req: Request, res: Response) => {
  throw new Error("Intended Exception!");
});

export { router as errorRouter };
