import express, { Request, Response } from "express";

import { BadRequestError } from "../../errors";
import { PasswordVault } from "../../services/password";
import { Staff } from "../../models/Staff";
import { body } from "express-validator";
import { validateRequest } from "../../middlewares";
import { createToken } from "../../services/token";
import { DESIGNATIONS } from "../../Interfaces/types";

const router = express.Router();

router.post(
  "/",
  [
    body("email").isEmail(),
    body("password").notEmpty().withMessage("You must supply a password"),
  ],
  validateRequest,
  async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;

    const staff = await Staff.findOne({ email });

    if (!staff) {
      const error = new BadRequestError("Invalid credentials");
      return res.status(error.statusCode).send(error.serializeErrors());
    }

    const passwordsDoMatch = await PasswordVault.compare(
      staff.password,
      password
    );

    if (!passwordsDoMatch) {
      const error = new BadRequestError("Invalid credentials");
      return res.status(error.statusCode).send(error.serializeErrors());
    }

    const token = createToken({
      _id: staff._id,
      designation: staff.designation as DESIGNATIONS,
      email: staff.email,
      name: staff.name,
    });

    return res.status(200).send({ staff, token });
  }
);

export { router as staffSigninRouter };
