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
      college: user.college,
    },
    process.env.JWT_KEY as jwt.Secret
  );
};
export default { createToken };
