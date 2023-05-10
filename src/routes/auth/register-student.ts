import express, { Request, Response } from "express";

import { BadRequestError } from "../../errors";
import { Student } from "../../models/Student";
import { body } from "express-validator";
import { validateRequest } from "../../middlewares";
import { DESIGNATIONS } from "../../Interfaces/types";
import { createToken } from "../../services/token";

const router = express.Router();

router.post(
  "/",
  // [
  //   body("name")
  //     .isLength({ min: 3, max: 50 })
  //     .withMessage("Name must be between 3 and 50 characters"),
  //   body("studentNumber")
  //     .isLength({ min: 10, max: 10 })
  //     .withMessage("Student Number must be 10 characters long"),
  //   body("registrationNumber")
  //     .isLength({ min: 10, max: 10 })
  //     .withMessage("Registration Number must be 10 characters long"),
  //   body("email").isEmail(),
  //   body("phone").isMobilePhone("en-UG"),
  //   body("college").isString(),
  //   body("password")
  //     .isLength({ min: 4, max: 26 })
  //     .withMessage("Password must be between 4 and 20 characters"),
  // ],
  // // validateRequest,
  async (req: Request, res: Response): Promise<any> => {
    let {
      name,
      registrationNumber,
      studentNumber,
      email,
      phone,
      college,
      password,
    } = req.body;

    const phoneInUse = await Student.findOne({ phone });

    if (phoneInUse) {
      const error = new BadRequestError("Phone already in use");
      return res.status(error.statusCode).send(error.serializeErrors());
    }

    const student = await Student.create({
      college,
      name,
      registrationNumber,
      studentNumber,
      email,
      phone,
      password,
      designation: DESIGNATIONS.STUDENT,
    });

    try {
      student.save();
    } catch (error) {
      console.log("ERROR: ", error);
    }

    const token = createToken({
      _id: student._id,
      designation: student.designation as DESIGNATIONS,
      email: student.email,
      name: student.name,
    });
    console.log("TOKEN: ", token);

    console.log("STUDENT: ", student);

    return res.status(201).send({ student, token });
  }
);

export { router as registerStudentRouter };
