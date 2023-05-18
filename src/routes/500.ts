import { Request, Response, Router } from "express";
import { InternalServerError } from "../errors";

const router = Router().get("/", async (req: Request, res: Response) => {
  
  throw new InternalServerError("Intended Exception")
});

export { router as errorRouter };
