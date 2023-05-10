import { getModelForClass, pre, prop, Severity } from "@typegoose/typegoose";
import { ComplaintType } from "../Interfaces/types";
import { PasswordVault } from "../services/password";

export class ComplaintSchema {
  @prop({ required: true, type: String, trim: true, length: 10 })
  studentNumber!: string;

  @prop({ required: true, type: String, trim: true, length: 15 })
  registrationNumber!: string;

  @prop({ required: true, type: String, trim: true, length: 50 })
  courseLecturer!: string;

  @prop({
    required: true,
    type: String,
    trim: true,
    length: 50,
    uppercase: true,
  })
  courseName!: string;

  @prop({
    required: true,
    type: String,
    trim: true,
    enum: ["ONE", "TWO", "THREE"],
    uppercase: true,
  })
  semester!: string;

  @prop({
    required: true,
    type: String,
    trim: true,
    length: 50,
    uppercase: true,
  })
  courseCode!: string;

  @prop({ required: true, type: String, trim: true, length: 50 })
  academicYearOfSitting!: string;

  @prop({
    required: true,
    type: String,
    trim: true,
    enum: ComplaintType,
    unique: true,
  })
  category!: string;
}

export const Complaint = getModelForClass(ComplaintSchema, {
  schemaOptions: {
    timestamps: true,
    virtuals: true,
    toJSON: {
      virtuals: true,
      getters: true,
      transform(_doc, ret): void {
        delete ret.password;
        delete ret.__v;
      },
    },
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
});
