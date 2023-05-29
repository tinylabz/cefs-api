import express, { Response, Request } from "express";

import { Complaint } from "../models/Complaint";
import { debug } from "../utils/debug";
import { COMPLAINT_STATUSES, DESIGNATIONS } from "../Interfaces";
import { validateObjectID } from "../middlewares/validate-objectid";
import { requireAuth } from "../middlewares";

const router = express.Router();

router.post("/", requireAuth, async (req: Request, res: Response) => {
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
    status,
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
      status,
      studentId: req.user?._id,
    });
    await complaint.save();
    return res.status(200).send({ complaint });
  } catch (error) {
    debug(error);

    return res.status(500).send((error as Error).message);
  }
});

router.get("/", requireAuth, async (req: Request, res: Response) => {
  let complaints;
  try {
    if (req.user?.designation === DESIGNATIONS.STUDENT)
      complaints = await Complaint.find({ studentId: req.user?._id });

    if (req.user?.designation === DESIGNATIONS.LECTURER) {
      const nameRegex = new RegExp(`\\b${req.user?.name}\\b`, "i");
      complaints = await Complaint.find({
        courseLecturer: { $regex: nameRegex },
      });
    }

    if (req.user?.designation === DESIGNATIONS.HOD)
      complaints = await Complaint.find({});

    return res.status(200).send({ complaints });
  } catch (error) {
    debug(error);
    return res.status(500).send((error as Error).message);
  }
});

router.get(
  "/:id",
  requireAuth,
  validateObjectID,
  async (req: Request, res: Response) => {
    try {
      const complaint = await Complaint.findById({ _id: req.params.id });
      return res.status(200).send({ complaint });
    } catch (error) {
      debug(error);
      return res.status(500).send((error as Error).message);
    }
  }
);

router.delete(
  "/:id",
  requireAuth,
  validateObjectID,
  async (req: Request, res: Response) => {
    try {
      const complaint = await Complaint.findByIdAndDelete({
        _id: req.params.id,
      });
      return res.status(200).send({ complaint });
    } catch (error) {
      debug(error);
      return res.status(500).send((error as Error).message);
    }
  }
);

router.patch(
  "/resolve/:id",
  requireAuth,
  validateObjectID,
  async (req: Request, res: Response) => {
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
      return res.status(500).send((error as Error).message);
    }
  }
);

router.delete("/", requireAuth, async (_req: Request, res: Response) => {
  try {
    const complaints = await Complaint.deleteMany({});
    return res.status(200).send({ complaints });
  } catch (error) {
    debug(error);
    return res.status(500).send((error as Error).message);
  }
});

export { router as complaintsRouter };
