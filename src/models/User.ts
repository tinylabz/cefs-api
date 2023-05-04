import { IToken } from "../Interfaces/Token";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

interface UserAttrs {
  firstName: string;
  lastName: string;
  phone: number;
  password: string;
  email: string;
}

export interface UserDoc extends mongoose.Document {
  firstName: string;
  lastName: string;
  phone: String;
  password: string;
  email: string;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
  createAuthToken(user: UserDoc): string;
  verfiyAuthToken(token: string): Promise<jwt.VerifyErrors | IToken>;
}

const userSchema = new mongoose.Schema<UserDoc>(
  {
    firstName: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      length: 50,
    },
    lastName: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      length: 50,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(_doc, ret): void {
        delete ret.password;
      },
    },
  }
);

userSchema.statics.build = (attrs: UserAttrs): UserDoc => {
  return new User(attrs);
};

userSchema.statics.createAuthToken = function (user: UserDoc): string {
  const userJWT = jwt.sign(
    {
      id: user.id,
      phone: user.phone,
    },
    process.env.JWT_KEY as jwt.Secret
  ) as string;

  return userJWT;
};

userSchema.statics.verifyAuthToken = async (
  token: string
): Promise<jwt.VerifyErrors | IToken> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_KEY as jwt.Secret, (err, payload) => {
      if (err) reject(err);

      resolve(payload as IToken);
    });
  });
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
