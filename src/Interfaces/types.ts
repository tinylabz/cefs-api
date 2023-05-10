import { Types } from "mongoose";

export enum ComplaintType {
  MISSING_MARK = "MISSING_MARKS",
  REMARK = "REMARK",
  WRONG_ACADEMIC_YEAR = "WRONG_ACADEMIC_YEAR",
}

export enum USER_TYPE {
  STUDENT = "STUDENT",
  STAFF = "STAFF",
}

export enum DESIGNATIONS {
  STUDENT = "STUDENT",
  LECTURER = "LECTURER",
  REGISTRAR = "REGISTRAR",
  HOD = "HOD",
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
}
export interface UserPayload {
  _id: Types.ObjectId;
  name: string;
  email: string;
  designation: DESIGNATIONS;
}

export interface IToken extends UserPayload {
  expiresIn: number;
}
