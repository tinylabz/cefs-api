import { Request, Response, Router } from "express";

import { BadRequestError } from "../../errors";
import { Staff, StaffSchema } from "../../models/Staff";
import { body } from "express-validator";
import { validateRequest } from "../../middlewares";
import { createToken } from "../../services/token";
import { DESIGNATIONS } from "../../Interfaces/types";

const router = Router().post(
  "/",
  [
    body("name")
      .isLength({ min: 3, max: 50 })
      .withMessage("Name must be between 3 and 50 characters"),
    body("email").isEmail(),
    body("phone").isMobilePhone("en-UG"),
    body("college").isString(),
    body("school").isString(),
    body("designation").isString(),
    body("password")
      .isLength({ min: 4, max: 26 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response): Promise<any> => {
    let { name, email, phone, designation, password, college, school } =
      req.body;

    const phoneInUse = await Staff.findOne({ phone });

    if (phoneInUse) {
      const error = new BadRequestError("Phone already in use");
      return res.status(error.statusCode).send(error.serializeErrors());
    }

    const staff = await Staff.create({
      college,
      name,
      school,
      designation,
      email,
      phone,
      password,
    });

    try {
      staff.save();
    } catch (error) {
      console.log("ERROR :", error);
    }

    const token = createToken({
      _id: staff._id,
      designation: staff.designation as DESIGNATIONS,
      email: staff.email,
      name: staff.name,
    });

    return res.status(201).send({ Staff: staff, token });
  }
);

export { router as registerStaffRouter };
