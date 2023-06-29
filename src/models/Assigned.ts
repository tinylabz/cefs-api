import { getModelForClass, prop, Severity } from "@typegoose/typegoose";
import mongoose from "mongoose";
import { Complaint } from "./Complaint";
import { Student } from "./Student";

export class AssignComplaintSchema {
  @prop({ required: false, index: true, type: String, trim: true, length: 50 })
  lecturerAssigned!: string;

  @prop({
    required: true,
    type: mongoose.Types.ObjectId,
    ref: Student,
  })
  studentId!: string;

  @prop({
    required: true,
    type: mongoose.Types.ObjectId,
    ref: Complaint,
  })
  complaintId!: string;

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

export const AssignComplaint = getModelForClass(AssignComplaintSchema, {
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
