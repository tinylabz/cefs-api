import { Request, Response, Router } from "express";

import { BadRequestError, InternalServerError, NotFoundError } from "../errors";
import { Student } from "../models/Student";
import { createToken } from "../services/token";
import { DESIGNATIONS } from "../Interfaces";
import { debug } from "../utils/debug";
import { PasswordVault } from "../services/password";
import { validateObjectID } from "../middlewares/validate-objectid";
import { mail } from "../utils/mailer";

const router = Router();

router.post("/signin", async (req: Request, res: Response): Promise<any> => {
  const { studentNumber, password } = req.body;
  try {
    const student = await Student.findOne({ studentNumber });

    if (!student) {
      const error = new BadRequestError("Invalid credentials");
      return res.status(error.statusCode).send(error.message);
    }

    const passwordsDoMatch = await PasswordVault.compare(
      student.password,
      password
    );

    if (!passwordsDoMatch) {
      const error = new BadRequestError("Invalid credentials");
      return res.status(error.statusCode).send(error.message);
    }

    const token = createToken({
      _id: student._id,
      designation: DESIGNATIONS.STUDENT,
      email: student.email,
      name: student.name,
    });
    debug(token);
    debug(student);

    return res.status(200).send({ user: student, token });
  } catch (error) {
    const err = new InternalServerError((error as Error).message);
    debug(error);
    return res.status(err.statusCode).send({ error: err.message });
  }
});

router.post("/register", async (req: Request, res: Response): Promise<any> => {
  let {
    name,
    registrationNumber,
    studentNumber,
    email,
    phone,
    college,
    password,
  } = req.body;

  try {
    const phoneInUse = await Student.findOne({ phone });

    if (phoneInUse) {
      const error = new BadRequestError("Phone already in use");
      return res.status(error.statusCode).send(error.message);
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

    await mail(email);
    await student.save();

    const token = createToken({
      _id: student._id,
      designation: student.designation as DESIGNATIONS,
      email: student.email,
      name: student.name,
    });
    debug("TOKEN: ", token);

    debug("STUDENT: ", student);

    return res.status(201).send({ user: student, token });
  } catch (error) {
    const err = new InternalServerError((error as Error).message);
    return res.status(err.statusCode).send({ error: err.message });
  }
});

router.get("/", async (req: Request, res: Response): Promise<Response> => {
  try {
    const students = await Student.find({});
    if (students.length < 1) {
      const err = new NotFoundError("No students found!");
      return res.status(err.statusCode).send({ error: err.message });
    }
    return res.status(200).send({ students });
  } catch (error) {
    const err = new InternalServerError((error as Error).message);
    debug(error);
    return res.status(err.statusCode).send({ error: err.message });
  }
});

router.get(
  "/:id",
  validateObjectID,
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const student = await Student.findById(req.params.id);
      if (!student) {
        const err = new NotFoundError("No such student found!");
        return res.status(err.statusCode).send({ error: err.message });
      }
      return res.status(200).send(student);
    } catch (error) {
      const err = new InternalServerError((error as Error).message);
      debug(error);
      return res.status(err.statusCode).send({ error: err.message });
    }
  }
);

export { router as studentRouter };
