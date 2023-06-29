import express, { Response, Request } from "express";
import { AssignComplaint } from "../models/Assigned";
import { requireAuth, validateObjectID } from "../middlewares";
import { Complaint } from "../models/Complaint";
import { sendMail } from "../services/mail";
import { Staff } from "../models/Staff";
import { DESIGNATIONS } from "../Interfaces";
import { Student } from "../models/Student";

const router = express.Router();

router.post(
  "/:id",
  requireAuth,
  validateObjectID,
  async (req: Request, res: Response) => {
    if (req.user?.designation !== DESIGNATIONS.HOD)
      return res.status(403).send("Only HOD can assign remark lecturers!");

    const { lecturerName, studentId } = req.body;

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).send("No such complaint found!");

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).send("No such student found!");

    const lecturer = await Staff.findOne({
      name: lecturerName,
      designation: DESIGNATIONS.LECTURER,
    });

    if (!lecturer)
      return res
        .status(404)
        .send("This lecturer is not yet registered in the system");

    const assignedComplaint = await AssignComplaint.create({
      lecturerAssigned: lecturerName,
      studentId,
    });

    await assignedComplaint.save();

    const htmlForLecturer = `<h2>You have been assigned to handle the remark course unit ${complaint.courseCode}. <br/>This was under the lecturer ${lecturerName} for student ${student.name} of Student No. ${student.studentNumber}</h2>`;
    const htmlForStudent = `<h2>Your complaint of nature ${complaint.nature} for coursecode ${complaint.courseCode} <br/> has been assigned the lecturer ${lecturer.name} to handle it. You'll be notified when it's done, thank you.</h2>`;

    sendMail(
      `${lecturer.email},'',''`,
      htmlForLecturer,
      `REMARK Complaint Submited by student ${student.name}`,
      "Comment "
    )
      .then(() => {
        return res.send(`Email Notification Sent to lecturer`);
      })
      .catch((err) => {
        return res.status(500).send((err as Error).message);
      });

    sendMail(
      `${student.email},'',''`,
      htmlForStudent,
      `REMARK Complaint assign lecturer ${lecturer.name}`,
      "Comment "
    )
      .then(() => {
        return res.send(`Email Notification Sent to lecturer`);
      })
      .catch((err) => {
        return res.status(500).send((err as Error).message);
      });

    return res.send("Lecturer successfully assigned");
  }
);

export { router as assignLecturerToRemarkRouter };
