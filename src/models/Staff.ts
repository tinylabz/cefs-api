import { getModelForClass, pre, prop, Severity } from "@typegoose/typegoose";
import { DESIGNATIONS } from "../Interfaces";
import { PasswordVault } from "../services/password";

@pre<StaffSchema>("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const hashedPassword = await PasswordVault.toHash(this.password);
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

  @prop({ required: true, type: String, trim: true, length: 50 })
  college!: string;

  @prop({ required: true, type: String, trim: true, length: 50 })
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
