import { Request, Response, Router } from "express";

import { BadRequestError, InternalServerError, NotFoundError } from "../errors";
import { Staff } from "../models/Staff";
import { body } from "express-validator";
import { validateRequest } from "../middlewares";
import { createToken } from "../services/token";
import { DESIGNATIONS } from "../Interfaces";
import { debug } from "../utils/debug";
import { PasswordVault } from "../services/password";
import { validateObjectID } from "../middlewares/validate-objectid";
import { mail } from "../utils/mailer";

const router = Router();

router.post(
  "/signin",
  [
    body("email").isEmail(),
    body("password").notEmpty().withMessage("You must supply a password"),
  ],
  validateRequest,
  async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;

    try {
      const staff = await Staff.findOne({ email });

      if (!staff) {
        const error = new BadRequestError("Invalid credentials");
        return res.status(error.statusCode).send(error.message);
      }

      const passwordsDoMatch = await PasswordVault.compare(
        staff.password,
        password
      );

      if (!passwordsDoMatch) {
        const error = new BadRequestError("Invalid credentials");
        return res.status(error.statusCode).send(error.message);
      }

      const token = createToken({
        _id: staff._id,
        designation: staff.designation as DESIGNATIONS,
        email: staff.email,
        name: staff.name,
      });
      return res.status(200).send({ user: staff, token });
    } catch (error) {
      const err = new InternalServerError((error as Error).message);
      return res.status(err.statusCode).send(err.message);
    }
  }
);

router.post("/register", async (req: Request, res: Response): Promise<any> => {
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
    });

    return res.status(201).send({ user: staff, token });
  } catch (error) {
    debug(error);
    return res.status(500).send((error as Error).message);
  }
});

router.get("/", async (req: Request, res: Response): Promise<Response> => {
  try {
    const staffs = await Staff.find({});
    if (staffs.length < 1) {
      const err = new NotFoundError("No staffs found!");
      return res.status(err.statusCode).send(err.message);
    }
    return res.status(200).send({ staffs });
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
      const staff = await Staff.findById(req.params.id);
      if (!staff) {
        const err = new NotFoundError("No such staff found!");
        return res.status(err.statusCode).send(err.message);
      }
      return res.status(200).send(staff);
    } catch (error) {
      debug(error);
      return res.status(500).send((error as Error).message);
    }
  }
);

router.delete("/", async (req: Request, res: Response): Promise<Response> => {
  try {
    const deleted = await Staff.deleteMany({});
    return res.status(200).send({ deleted });
  } catch (error) {
    debug(error);
    return res.status(500).send((error as Error).message);
  }
});

export { router as staffRouter };
