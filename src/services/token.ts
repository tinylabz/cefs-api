import { UserPayload } from "../Interfaces";
import { __PROD__ } from "../config/__prod__";
import jwt from "jsonwebtoken";

export const createToken = (user: UserPayload): string => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      designation: user.designation,
    },
    process.env.JWT_KEY as jwt.Secret
    // {
    //   expiresIn: __PROD__ ? "1d" : "4d",
    // }
  );
};
export default { createToken };
