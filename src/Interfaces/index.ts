import { Types } from "mongoose";

export enum NATURE {
  MISSING_MARK = "MISSING_MARKS",
  REMARK = "REMARK",
  WRONG_ACADEMIC_YEAR = "WRONG_ACADEMIC_YEAR",
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
  SUBMITTED = "SUBMITTED",
  PENDING = "PENDING",
  RESOLVED = "RESOLVED",
}

export type UserPayload = {
  _id: Types.ObjectId;
  name: string;
  email: string;
  designation: DESIGNATIONS;
};
