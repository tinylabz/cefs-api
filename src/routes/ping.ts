import { Request, Response, Router } from "express";

const router = Router().get("/", async (req: Request, res: Response) => {
  return res.status(200).send("pong");
});

export { router as pingRouter };
