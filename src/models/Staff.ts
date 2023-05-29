import { getModelForClass, pre, prop, Severity } from "@typegoose/typegoose";
import { COLLEGES, DESIGNATIONS, SCHOOLS } from "../Interfaces";
import { Passwd } from "../services/password";

@pre<StaffSchema>("save", async function (next) {
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
export class StaffSchema {
  @prop({ required: true, type: String, trim: true, length: 50 })
  name!: string;

  @prop({ required: true, type: String, trim: true, unique: true })
  email!: string;

  @prop({ required: false, default: false, type: Boolean })
  isEmailVerified!: boolean;

  @prop({ required: true, type: String, trim: true, enum: COLLEGES })
  college!: string;

  @prop({ required: true, type: String, trim: true, enum: SCHOOLS })
  school!: string;

  @prop({
    required: true,
    type: String,
    trim: true,
    enum: DESIGNATIONS,
  })
  designation!: string;

  @prop({ required: true, type: String })
  password!: string;
}

export const Staff = getModelForClass(StaffSchema, {
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
