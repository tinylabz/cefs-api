import { Document } from "mongoose";
import { IToken } from "../Interfaces/Token";
import { IUser } from "../Interfaces/User";
import { __PROD__ } from "../config/__prod__";
import jwt from "jsonwebtoken";

export const createToken = (user: Document<IUser>): string => {
  return jwt.sign({ id: user._id }, process.env.JWT_KEY as jwt.Secret, {
    expiresIn: __PROD__ ? "1d" : "4d",
  });
};

export const verifyToken = async (
  token: string
): Promise<jwt.VerifyErrors | IToken> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_KEY as jwt.Secret, (err, payload) => {
      if (err) reject(err);

      resolve(payload as IToken);
    });
  });
};

export default { createToken, verifyToken };
