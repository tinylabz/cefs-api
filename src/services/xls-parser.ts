import { PathLike } from "node:fs";
import xlsx from "xlsx";

export const parser = (filePath: PathLike) => {
  const workbook = xlsx.readFile(filePath as string);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const content = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

  return content;
};

type Result = {
  courseWork: number;
  exam: number;
  finalMark: number;
} | null;
type Sheet = unknown[];
type Row = [number, string, number, string, number, number, number] | undefined;

export const searchMarkSheet = (
  sheet: Sheet,
  studentNumber: number
): Result => {
  let desiredRow: Row;
  if (studentNumber) {
    sheet.forEach((row: unknown) => {
      if ((row as Row)![2] === studentNumber) desiredRow = row as Row;
    });
  }
  return desiredRow
    ? {
        finalMark: desiredRow[4],
        courseWork: desiredRow[5],
        exam: desiredRow[6],
      }
    : null;
};

type TestRow = [string, number, string] | undefined;

export const searchTestsAttendenceSheet = (
  sheet: Sheet,
  studentNumber: number
): boolean => {
  let desiredRow: TestRow;

  if (studentNumber) {
    sheet.forEach((row: unknown) => {
      if ((row as TestRow)![1] === studentNumber) desiredRow = row as TestRow;
    });
  }
  return desiredRow ? true : false;
};

type ExamRow = [string, number, string, number] | undefined;

export const searchExamAttendenceSheet = (
  sheet: Sheet,
  studentNumber: number
): boolean => {
  let desiredRow: ExamRow;
  if (studentNumber) {
    sheet.forEach((row: unknown) => {
      if ((row as ExamRow)![1] === studentNumber) desiredRow = row as ExamRow;
    });
  }
  return desiredRow ? true : false;
};
