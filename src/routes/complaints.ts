import express, { Response, Request } from "express";

import { Complaint } from "../models/Complaint";
import { debug } from "../utils/debug";
import { InternalServerError } from "../errors";
import { COMPLAINT_STATUSES } from "../Interfaces";

const router = express.Router();

router.post("/create", async (req: Request, res: Response) => {
  const {
    studentNumber,
    registrationNumber,
    courseLecturer,
    courseCode,
    courseName,
    semester,
    academicYearAllocated,
    academicYearOfSitting,
    recieptURL,
    correctAcademicYear,
    nature,
  } = req.body;

  try {
    const complaint = await Complaint.create({
      academicYearOfSitting,
      recieptURL,
      studentNumber,
      courseLecturer,
      registrationNumber,
      courseCode,
      courseName,
      semester,
      academicYearAllocated,
      correctAcademicYear,
      nature,
    });
    await complaint.save();
    return res.status(200).send({ complaint });
  } catch (error) {
    debug(error);
    const err = new InternalServerError((error as Error).message);
    return res.status(err.statusCode).send({ message: err.message });
  }
});

router.get("/", async (_req: Request, res: Response) => {
  try {
    const complaints = await Complaint.find({});
    return res.status(200).send({ complaints });
  } catch (error) {
    debug(error);
    const err = new InternalServerError((error as Error).message);
    return res.status(err.statusCode).send({ message: err.message });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const complaint = await Complaint.findById({ _id: req.params.id });
    return res.status(200).send({ complaint });
  } catch (error) {
    debug(error);
    const err = new InternalServerError((error as Error).message);
    return res.status(err.statusCode).send({ message: err.message });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const complaint = await Complaint.findByIdAndDelete({ _id: req.params.id });
    return res.status(200).send({ complaint });
  } catch (error) {
    debug(error);
    const err = new InternalServerError((error as Error).message);
    return res.status(err.statusCode).send({ message: err.message });
  }
});

router.patch("/resolve/:id", async (req: Request, res: Response) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      {
        status: COMPLAINT_STATUSES.RESOLVED,
      },
      { new: false }
    );
    return res.status(200).send({ complaint });
  } catch (error) {
    debug(error);
    const err = new InternalServerError((error as Error).message);
    return res.status(err.statusCode).send({ message: err.message });
  }
});

export { router as complaintsRouter };
