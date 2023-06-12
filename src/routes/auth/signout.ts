import express, { Request, Response } from "express";

import { requireAuth } from "../../middlewares/require-auth";

const router = express.Router();

router.patch("/", requireAuth, (_: Request, res: Response) => {
  return res.send({ message: "Session destroyed" });
});

export { router as signoutRouter };
