import { Request, Response, Router } from "express";

import { BadRequestError, InternalServerError, NotFoundError } from "../errors";
import { Staff } from "../models/Staff";
import { body } from "express-validator";
import { requireAuth, validateRequest } from "../middlewares";
import { createToken } from "../services/token";
import { COLLEGES, DESIGNATIONS } from "../Interfaces";
import { debug } from "../utils/debug";
import { Passwd } from "../services/password";
import { validateObjectID } from "../middlewares/validate-objectid";

const router = Router();

router.post(
  "/signin",
  [
    body("email").isEmail().withMessage("You must provde a valid email!"),
    body("password").notEmpty().withMessage("You must supply a password!"),
  ],
  validateRequest,
  async (req: Request, res: Response): Promise<Response> => {
    const { email, password } = req.body;

    try {
      const staff = await Staff.findOne({ email });

      if (!staff) {
        const error = new BadRequestError("Invalid credentials");
        return res.status(error.statusCode).send(error.message);
      }

      const passwordsDoMatch = await Passwd.compare(staff.password, password);

      if (!passwordsDoMatch) {
        const error = new BadRequestError("Invalid credentials");
        return res.status(error.statusCode).send(error.message);
      }

      const token = createToken({
        _id: staff._id,
        designation: staff.designation as DESIGNATIONS,
        email: staff.email,
        name: staff.name,
        college: staff.college as COLLEGES,
      });
      return res.send({ user: staff, token });
    } catch (error) {
      const err = new InternalServerError((error as Error).message);
      return res.status(err.statusCode).send(err.message);
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
    body("designation")
      .isString()
      .notEmpty()
      .withMessage("You must supply a designation"),
    body("password")
      .isString()
      .notEmpty()
      .withMessage("You must supply a password"),
    body("college")
      .isString()
      .notEmpty()
      .withMessage("You must supply a college"),
    body("school")
      .isString()
      .notEmpty()
      .withMessage("You must supply a school"),
  ],
  validateRequest,
  async (req: Request, res: Response): Promise<Response> => {
    let { name, email, designation, password, college, school } = req.body;

    try {
      let staff = await Staff.findOne({ email });

      debug({ name, email, designation, password, college, school });
      if (staff) {
        const error = new BadRequestError("Email already in use");
        return res.status(error.statusCode).send(error.message);
      }

      staff = await Staff.create({
        college,
        name,
        school,
        designation,
        email,
        password,
      });

      await staff.save();

      const token = createToken({
        _id: staff._id,
        designation: staff.designation as DESIGNATIONS,
        email: staff.email,
        name: staff.name,
        college: staff.college as COLLEGES,
      });

      return res.status(201).send({ user: staff, token });
    } catch (error) {
      debug(error);
      return res.status(500).send((error as Error).message);
    }
  }
);

router.get(
  "/",
  requireAuth,
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const staffs = await Staff.find({});
      if (staffs.length < 1) {
        const err = new NotFoundError("No staffs found!");
        return res.status(err.statusCode).send(err.message);
      }
      return res.send({ staffs });
    } catch (error) {
      debug(error);
      return res.status(500).send((error as Error).message);
    }
  }
);

router.get(
  "/:id",
  requireAuth,
  validateObjectID,
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const staff = await Staff.findById(req.params.id);
      if (!staff) {
        const err = new NotFoundError("No such staff found!");
        return res.status(err.statusCode).send(err.message);
      }
      return res.send(staff);
    } catch (error) {
      debug(error);
      return res.status(500).send((error as Error).message);
    }
  }
);

router.delete(
  "/",
  requireAuth,
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const deleted = await Staff.deleteMany({});
      return res.send({ deleted });
    } catch (error) {
      debug(error);
      return res.status(500).send((error as Error).message);
    }
  }
);

export { router as staffRouter };
