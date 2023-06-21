import PDFDocument from "pdfkit";
import express, { Response, Request } from "express";
import { requireAuth } from "../middlewares";
import { Complaint } from "../models/Complaint";
import { Student } from "../models/Student";
import { NATURE } from "../Interfaces";

const router = express.Router();

router.get("/", requireAuth, async (_: Request, res: Response) => {
  const doc = new PDFDocument();

  const complaints = await Complaint.find({});
  const students = await Student.find({});

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", 'attachment; filename="report.pdf"');

  doc.pipe(res);

  const title = "CEFS Report";
  doc.font("Helvetica-Bold").fontSize(26).text(title, { align: "center" });

  const tableData = [
    [
      "RegNo.",
      "Course unit",
      "Code",
      "Nature",
      "Status",
      "Course Lecturer",
      "Status",
      "Date",
    ],
  ];

  complaints.forEach((complaint) => {
    const student = students.find(
      (student) => student._id.toString() === complaint.studentId.toString()
    );
    const studentName = student?.name!;

    const parts = complaint.createdAt.toString().split(" ");
    const date = `${parts[2]}/${parts[1]}/${parts[3]}`;

    tableData.push([
      complaint.registrationNumber,
      complaint.courseName || "N/A",
      complaint.courseCode,
      complaint.nature === NATURE.WRONG_ACADEMIC_YEAR
        ? "W-A-Y"
        : complaint.nature === NATURE.MISSING_MARK
        ? "M-M"
        : complaint.nature,
      complaint.status,
      complaint.courseLecturer || "N/A",
      date,
    ]);
  });

  let positionX = 50;
  let positionY = 150;

  doc.font("Helvetica-Bold").fontSize(12);
  doc.fillColor("#ffffff");
  doc.rect(positionX, positionY, 1000, 30).fill("#006B4D");
  doc.fillColor("#ffffff");

  tableData[0].forEach((header) => {
    doc.text(header, positionX + 5, positionY + 5, {
      width: 80,
      align: "left",
    });
    positionX += 80;
  });

  doc.moveDown();

  doc.font("Helvetica").fontSize(12);
  doc.fillColor("#000000");

  positionY += 30;
  tableData.slice(1).forEach((row, rowIndex) => {
    positionX = 50;
    if (rowIndex % 2 === 0) {
      doc.fillColor("#f2f2f2");
      doc.rect(positionX, positionY, 800, 20).fill("#f2f2f2");
      doc.fillColor("#000000");
    }

    row.forEach((cell) => {
      doc.text(cell, positionX + 5, positionY + 5, {
        width: 70,
        align: "left",
      });
      positionX += 80;
    });
    positionY += 20;
  });

  doc.end();
});

export { router as reportRouter };
