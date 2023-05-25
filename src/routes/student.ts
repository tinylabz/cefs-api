import { Request, Response, Router } from "express";

import { BadRequestError, NotFoundError } from "../errors";
import { Student } from "../models/Student";
import { createToken } from "../services/token";
import { DESIGNATIONS } from "../Interfaces";
import { debug } from "../utils/debug";
import { Passwd } from "../services/password";
import { validateObjectID } from "../middlewares/validate-objectid";
import { body } from "express-validator";
import { validateRequest } from "../middlewares";

const router = Router();

router.post(
  "/signin",
  [
    body("studentNumber")
      .isString()
      .notEmpty()
      .withMessage("Student Number is required"),
    body("password")
      .isString()
      .notEmpty()
      .withMessage("You must supply a password"),
  ],
  validateRequest,
  async (req: Request, res: Response): Promise<any> => {
    const { studentNumber, password } = req.body;
    try {
      const user = await Student.findOne({ studentNumber });

      if (!user) {
        const error = new BadRequestError("Invalid credentials");
        return res.status(error.statusCode).send(error.message);
      }

      const passwordsDoMatch = await Passwd.compare(user.password, password);

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
  }
);

router.post(
  "/register",
  [
    body("name").isString().notEmpty().withMessage("name is required"),
    body("email")
      .isEmail()
      .notEmpty()
      .withMessage("You must supply a valid email"),
    body("password")
      .isString()
      .notEmpty()
      .withMessage("You must supply a password"),
    body("college")
      .isString()
      .notEmpty()
      .withMessage("You must supply a college"),
    body("studentNumber")
      .isString()
      .notEmpty()
      .withMessage("You must supply a student number"),
    body("registrationNumber")
      .isString()
      .notEmpty()
      .withMessage("You must supply a registration number"),
  ],
  validateRequest,
  async (req: Request, res: Response): Promise<any> => {
    let { name, registrationNumber, studentNumber, email, college, password } =
      req.body;

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
  }
);

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
