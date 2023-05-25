import express, { Request, Response } from "express";
import { chat } from "../services/chat";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const response = await chat();
  return res.send(response);
});

export { router as chatRouter };
