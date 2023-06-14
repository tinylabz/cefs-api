import { PathLike } from "node:fs";
import xlsx from "xlsx";

export const parseSheet2JSON = (path: PathLike) => {
  const workbook = xlsx.readFile(path as string);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  return xlsx.utils.sheet_to_json(worksheet, { header: 1 });
};

type Result =
  | {
      courseWork: number;
      exam: number;
      finalMark: number;
    }
  | null
  | undefined;
export type Sheet = unknown[];
type Row = [number, string, number, string, number, number, number] | undefined;

export const searchMarkSheet = (
  sheet: Sheet,
  studentNumber: number
): Result => {
  if (!studentNumber) return;

  const record = sheet.find(
    (row: unknown) => (row as Row)![2] === studentNumber
  ) as Row;

  return record
    ? {
        finalMark: record[4],
        courseWork: record[5],
        exam: record[6],
      }
    : null;
};

type TestRow = [string, number, string] | undefined;

export const searchTestsAttendenceSheet = (
  sheet: Sheet,
  studentNumber: number
): boolean | undefined => {
  if (!studentNumber) return;
  const record = sheet.find(
    (row: unknown) => (row as TestRow)![1] === studentNumber
  ) as TestRow;

  return record ? true : false;
};

type ExamRow = [string, number, string, number] | undefined;

export const searchExamAttendenceSheet = (
  sheet: Sheet,
  studentNumber: number
): boolean | undefined => {
  if (!studentNumber) return;

  const record = sheet.find(
    (row: unknown) => (row as ExamRow)![1] === studentNumber
  ) as ExamRow;

  return record ? true : false;
};
