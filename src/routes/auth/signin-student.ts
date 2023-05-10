import express, { Request, Response } from "express";

import { BadRequestError } from "../../errors";
import { PasswordVault } from "../../services/password";
import { Student } from "../../models/Student";
import { body } from "express-validator";
import { validateRequest } from "../../middlewares";
import { createToken } from "../../services/token";
import { DESIGNATIONS } from "../../Interfaces/types";

const router = express.Router();

router.post("/", async (req: Request, res: Response): Promise<any> => {
  const { studentNumber, password } = req.body;

  const student = await Student.findOne({ studentNumber });
  console.log("STUDENT: ", student);

  if (!student) {
    const error = new BadRequestError("Invalid credentials");
    return res.status(error.statusCode).send(error.serializeErrors());
  }

  const passwordsDoMatch = await PasswordVault.compare(
    student.password,
    password
  );

  if (!passwordsDoMatch) {
    const error = new BadRequestError("Invalid credentials");
    return res.status(error.statusCode).send(error.serializeErrors());
  }
  console.log("STUDENT: 1", student);

  const token = createToken({
    _id: student._id,
    designation: DESIGNATIONS.STUDENT,
    email: student.email,
    name: student.name,
  });
  console.log("TOKEN: ", token);
  console.log("STUDENT: ", student);

  return res.status(200).send({ student, token });
});

export { router as studentSigninRouter };
