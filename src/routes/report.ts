import PDFDocument from "pdfkit";
import express, { Response, Request } from "express";
import { requireAuth } from "../middlewares";

const router = express.Router();

router.get("/", requireAuth, async (req: Request, res: Response) => {
  const doc = new PDFDocument();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", 'attachment; filename="report.pdf"');

  doc.pipe(res);
  // Define the table data
  // Define the table data
  // Define the table data
  const tableData = [
    ["ID", "First Name", "Last Name", "Email"],
    ["1", "John", "Doe", "john@example.com"],
    ["2", "Jane", "Smith", "jane@example.com"],
    ["3", "Bob", "Johnson", "bob@example.com"],
    // Add more rows as needed
  ];

  // Set the initial position for the table
  let positionX = 50;
  let positionY = 50;

  // Set the table header style
  doc.font("Helvetica-Bold").fontSize(12);
  doc.fillColor("#ffffff");
  doc.rect(positionX, positionY, 500, 30).fill("#333333");
  doc.fillColor("#ffffff");

  // Draw the table headers
  tableData[0].forEach((header, index) => {
    doc.text(header, positionX + 5, positionY + 5);
    positionX += 125;
  });

  // Set the table row style
  doc.font("Helvetica").fontSize(12);
  doc.fillColor("#000000");

  // Draw the table rows
  positionY += 30;
  tableData.slice(1).forEach((row) => {
    positionX = 50;
    row.forEach((cell, index) => {
      doc.text(cell, positionX + 5, positionY + 5);
      positionX += 125;
    });
    positionY += 20;
  });

  doc.end();
});

export { router as reportRouter };
