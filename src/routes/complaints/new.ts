import express, { Response, Request } from "express";

import { Complaint } from "../../models/Complaint";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  const complaints = await Complaint.find();
  return res.status(200).send({ data: complaints });
});

export { router as newComplaintRouter };
