import { Request, Response, Router } from "express";

const router = Router().get("/", async (req: Request, res: Response) => {
  return res.send({ message: "pong" });
});

export { router as pingRouter };
