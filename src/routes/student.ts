import { Request, Response, Router } from "express";

import { BadRequestError, InternalServerError, NotFoundError } from "../errors";
import { Student } from "../models/Student";
import { createToken } from "../services/token";
import { DESIGNATIONS } from "../Interfaces";
import { debug } from "../utils/debug";
import { PasswordVault } from "../services/password";
import { validateObjectID } from "../middlewares/validate-objectid";

const router = Router();

router.post("/signin", async (req: Request, res: Response): Promise<any> => {
  const { studentNumber, password } = req.body;
  try {
    const user = await Student.findOne({ studentNumber });

    if (!user) {
      const error = new BadRequestError("Invalid credentials");
      return res.status(error.statusCode).send(error.message);
    }

    const passwordsDoMatch = await PasswordVault.compare(
      user.password,
      password
    );

    if (!passwordsDoMatch) {
      const error = new BadRequestError("Invalid credentials");
      return res.status(error.statusCode).send(error.message);
    }

    const token = createToken({
      _id: user._id,
      designation: DESIGNATIONS.STUDENT,
      email: user.email,
      name: user.name,
    });
    debug(token);
    debug(user);

    return res.status(200).send({ user, token });
  } catch (error) {
    debug(error);
    return res.status(500).send((error as Error).message);
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
    let user = await Student.findOne({ email });

    if (user) {
      const error = new BadRequestError("Email Already in use");
      return res.status(error.statusCode).send(error.message);
    }

    user = await Student.create({
      name,
      college,
      registrationNumber,
      studentNumber,
      email,
      phone,
      password,
      designation: DESIGNATIONS.STUDENT,
    });

    await user.save();

    const token = createToken({
      _id: user._id,
      designation: user.designation as DESIGNATIONS,
      email: user.email,
      name: user.name,
    });
    debug("TOKEN: ", token);

    debug("STUDENT: ", user);

    return res.status(201).send({ user, token });
  } catch (error) {
    return res.status(500).send((error as Error).message);
  }
});

router.get("/", async (req: Request, res: Response): Promise<Response> => {
  try {
    const students = await Student.find({});
    if (students.length < 1) {
      const err = new NotFoundError("No students found!");
      return res.status(err.statusCode).send(err.message);
    }
    return res.status(200).send({ students });
  } catch (error) {
    debug(error);
    return res.status(500).send((error as Error).message);
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
        return res.status(err.statusCode).send(err.message);
      }
      return res.status(200).send(student);
    } catch (error) {
      debug(error);
      return res.status(500).send((error as Error).message);
    }
  }
);

router.delete("/", async (req: Request, res: Response): Promise<Response> => {
  try {
    const deleted = await Student.deleteMany({});
    return res.status(200).send({ deleted });
  } catch (error) {
    debug(error);
    return res.status(500).send((error as Error).message);
  }
});

export { router as studentRouter };
