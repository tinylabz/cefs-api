import express, { Request, Response } from "express";

import { BadRequestError } from "../../errors";
import { PasswordManager } from "../../services/password";
import { User } from "../../models/User";
import { body } from "express-validator";
import { validateRequest } from "../../middlewares";

const router = express.Router();

router.post(
  "/",
  [
    body("name")
      .isLength({ min: 3, max: 25 })
      .withMessage("Name must be between 3 and 25 characters"),
    body("phone").isMobilePhone("en-UG"),
    body("password")
      .isLength({ min: 4, max: 26 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response): Promise<any> => {
    let { firstName, lastName, email, phone, password } = req.body;

    const phoneInUse = await User.findOne({ phone });

    if (phoneInUse) {
      const error = new BadRequestError("Phone already in use");
      return res.status(error.statusCode).send(error.serializeErrors());
    }

    password = await PasswordManager.toHash(password);
    const user = User.build({
      firstName,
      lastName,
      email,
      phone,
      password,
    });

    await user.save();

    const userJWT = User.createAuthToken(user);
    req.session.jwt = userJWT;

    return res.status(201).send({ user, authToken: userJWT });
  }
);

export { router as signupRouter };
