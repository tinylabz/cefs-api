import { Types } from "mongoose";

export enum NATURE {
  MISSING_MARK = "MISSING MARKS",
  REMARK = "REMARK",
  WRONG_ACADEMIC_YEAR = "WRONG ACADEMIC YEAR",
}

export enum DESIGNATIONS {
  STUDENT = "STUDENT",
  LECTURER = "LECTURER",
  REGISTRAR = "REGISTRAR",
  HOD = "HOD",
}

export enum GENDER {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

export enum SEMESTER {
  ONE = "ONE",
  TWO = "TWO",
  THREE = "THREE",
}

export enum COMPLAINT_STATUSES {
  PENDING = "PENDING",
  RESOLVED = "RESOLVED",
}

export type UserPayload = {
  _id: Types.ObjectId;
  name: string;
  email: string;
  designation: DESIGNATIONS;
};
