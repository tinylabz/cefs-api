import express, { Request, Response } from "express";
import { main } from "../services/chat";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  main()
    // @ts-ignore
    .then((response) => res.send(response.data?.choices[0]?.message.content))
    .catch((err) => res.send(err.response?.data));
});

export { router as chatRouter };
