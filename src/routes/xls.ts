import express, { Request, Response } from "express";
import {
  parser,
  searchTestsAttendenceSheet,
  searchMarkSheet,
  searchExamAttendenceSheet,
} from "../services/xls-parser";
import { requireAuth } from "../middlewares";
import path from "node:path";

const router = express.Router();

router.get("/", requireAuth, async (req: Request, res: Response) => {
  const { studentNumber } = req.query;

  if (!studentNumber)
    return res.status(400).send("Please specify a student number");

  const pathToMarkSheet = path.join(
    __dirname,
    "..",
    "..",
    "public",
    "marks",
    "646df39a9e28679fcda60968-testcefs.xls"
  );
  const pathToTestAttendenceSheet = path.join(
    __dirname,
    "..",
    "..",
    "public",
    "attendence",
    "test",
    "64676bfc76ede5e2f831806b-cefstests attendance sheet.xlsx"
  );
  const pathToExamAttendenceSheet = path.join(
    __dirname,
    "..",
    "..",
    "public",
    "attendence",
    "exam",
    "646df39a9e28679fcda60968-cefsexamination attendance sheet.xlsx"
  );

  if (!pathToMarkSheet) return res.status(400).send("No file path detected");
  if (!pathToExamAttendenceSheet)
    return res.status(400).send("No file path detected for exam");
  if (!pathToTestAttendenceSheet)
    return res.status(400).send("No file path detected for tests");

  try {
    const markSheet = parser(pathToMarkSheet);
    const testSheet = parser(pathToTestAttendenceSheet);
    const examSheet = parser(pathToExamAttendenceSheet);

    let student = searchTestsAttendenceSheet(testSheet, Number(studentNumber));
    if (!student)
      return res
        .status(404)
        .send(
          "No attendence record for specified student in the tests attendence list!"
        );

    student = searchExamAttendenceSheet(examSheet, Number(studentNumber));
    if (!student)
      return res
        .status(404)
        .send(
          "No attendence record for specified student in the exam attendence list!"
        );

    const result = searchMarkSheet(markSheet, Number(studentNumber));
    if (!result)
      return res
        .status(404)
        .send(
          `No results for student ${req.user?.name} in the specified course unit. This mean that the student never sat for any of the C/W, tests or final exam`
        );
    res.status(200).send(result);
  } catch (error) {
    console.error("Error parsing the file:", error);
    res.status(500).send("Error parsing the file.");
  }
});
export { router as xlsRouter };
