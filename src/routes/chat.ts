import { Request, Response, Router } from "express";
import { completion } from "../services/chat";

const router = Router().post("/", async (req: Request, res: Response) => {
  const { intent } = req.body;
  try {
    const response = await completion(intent);
    return res.send(response);
  } catch (error) {
    return res.status(500).send(error);
  }
});

export { router as chatRouter };
