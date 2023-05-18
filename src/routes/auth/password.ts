import express, { Request, Response } from "express";
import { requireAuth } from "../../middlewares";
import { Student } from "../../models/Student";
import { InternalServerError } from "../../errors";

const router = express.Router();

router.patch("/", requireAuth, async (req: Request, res: Response) => {
  try {
    const { newPassword, confirmNewPassword } = req.body;

    const user = await Student.findByIdAndUpdate(
      req.user?._id,
      { password: newPassword },
      { new: true }
    );

    await user?.save();
  } catch (error) {
    const err = new InternalServerError((error as Error).message);
    return res.status(err.statusCode).send({ error: err.message });
  }
});

export { router as passwordChangeRouter };
