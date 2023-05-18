import { Router, Response, Request } from "express";
import { Student } from "../../models/Student";
import { debug } from "../../utils/debug";
import { InternalServerError } from "../../errors";

const router = Router();

router.get("/students/:id", async (req: Request, res: Response) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { isEmailVerified: true },
      { new: true }
    );

    debug("Email verified :", student);
    return res.status(200).send({ message: "Email Verified" });
  } catch (error) {
    const err = new InternalServerError((error as Error).message);
    return res.status(err.statusCode).send({ error: err.message });
  }
});

router.get("/staff/:id", async (req: Request, res: Response) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { isEmailVerified: true },
      { new: true }
    );

    debug(student);
  } catch (error) {
    const err = new InternalServerError((error as Error).message);
    return res.status(err.statusCode).send({ error: err.message });
  }
});

export { router as verifyEmailRouter };
