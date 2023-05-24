import { getModelForClass, pre, prop, Severity } from "@typegoose/typegoose";
import { DESIGNATIONS } from "../Interfaces";
import { Passwd } from "../services/password";

@pre<StudentSchema>("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const hashedPassword = await Passwd.toHash(this.password);
    this.password = hashedPassword;

    next();
  } catch (error: any) {
    return next(error);
  }
})
export class StudentSchema {
  @prop({ required: true, type: String, trim: true, length: 50 })
  name!: string;

  @prop({ required: true, type: String, trim: true, unique: true })
  email!: string;

  @prop({ required: false, default: false, type: Boolean })
  isEmailVerified!: boolean;

  @prop({ required: true, type: String, unique: true, trim: true, length: 10 })
  studentNumber!: string;

  @prop({ required: true, type: String, unique: true, trim: true, length: 15 })
  registrationNumber!: string;

  @prop({
    required: true,
    type: String,
    trim: true,
    uppercase: true,
    length: 50,
  })
  college!: string;

  @prop({
    required: false,
    type: String,
    trim: true,
    enum: DESIGNATIONS,
    default: DESIGNATIONS.STUDENT,
  })
  designation!: string;

  @prop({ required: true, type: String })
  password!: string;
}

export const Student = getModelForClass(StudentSchema, {
  schemaOptions: {
    timestamps: true,
    toJSON: {
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
