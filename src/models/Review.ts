import { getModelForClass, prop, Severity } from "@typegoose/typegoose";

export class ReviewSchema {
  @prop({ required: true, type: String, trim: true, length: 500 })
  description!: string;

  @prop({ required: true, type: Number, min: 1, max: 5 })
  value!: number;

  @prop({ required: true, type: String, length: 50 })
  user!: string;
}

export const Review = getModelForClass(ReviewSchema, {
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
