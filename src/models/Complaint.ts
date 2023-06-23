import { getModelForClass, prop, Severity } from "@typegoose/typegoose";
import { COMPLAINT_STATUSES, NATURE, SEMESTER } from "../Interfaces";
import { Student } from "./Student";
import mongoose from "mongoose";

export class ComplaintSchema {
  @prop({ required: true, type: String, trim: true, length: 10 })
  studentNumber!: string;

  @prop({
    required: true,
    type: String,
    trim: true,
    length: 15,
    uppercase: true,
  })
  registrationNumber!: string;

  @prop({ required: false, index: true, type: String, trim: true, length: 50 })
  courseLecturer!: string;

  @prop({
    required: false,
    type: String,
    trim: true,
    length: 50,
    uppercase: true,
  })
  courseName!: string;

  @prop({
    required: false,
    type: String,
    trim: true,
    enum: [SEMESTER.ONE, SEMESTER.TWO, SEMESTER.THREE],
    uppercase: true,
  })
  semester!: string;

  @prop({
    required: true,
    type: String,
    trim: true,
    enum: [COMPLAINT_STATUSES.PENDING, COMPLAINT_STATUSES.RESOLVED],
    uppercase: true,
    default: COMPLAINT_STATUSES.PENDING,
  })
  status!: string;

  @prop({
    required: false,
    type: String,
    trim: true,
    length: 50,
    uppercase: true,
  })
  courseCode!: string;

  @prop({ required: false, type: String, trim: true, length: 50 })
  academicYearOfSitting!: string;

  @prop({
    required: false,
    type: String,
    trim: true,
    enum: NATURE,
  })
  nature!: string;

  @prop({
    required: false,
    type: String,
    trim: true,
    default: undefined,
  })
  recieptURL!: string;

  @prop({
    required: false,
    type: String,
    default: undefined,
  })
  academicYearAllocated!: string;

  @prop({ required: false, type: String, default: undefined })
  correctAcademicYear!: string;

  @prop({
    required: true,
    type: mongoose.Types.ObjectId,
    ref: Student, // Reference the Student model or document
  })
  studentId!: string;

  @prop({
    required: true,
    type: mongoose.Schema.Types.Date,
    default: Date.now,
  })
  createdAt!: Date;

  @prop({
    required: true,
    type: mongoose.Schema.Types.Date,
    default: Date.now,
  })
  updatedAt!: Date;
}

export const Complaint = getModelForClass(ComplaintSchema, {
  schemaOptions: {
    timestamps: true,
    toJSON: {
      transform(_doc, ret): void {
        delete ret.__v;
      },
    },
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
});
