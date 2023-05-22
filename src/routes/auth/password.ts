import express, { Request, Response } from "express";
import { requireAuth } from "../../middlewares";
import { Student } from "../../models/Student";
import { Passwd } from "../../services/password";
import { debug } from "../../utils/debug";

const router = express.Router();

router.patch("/", requireAuth, async (req: Request, res: Response) => {
  try {
    const { newPassword, confirmNewPassword } = req.body;

    if (newPassword !== confirmNewPassword)
      return res.status(400).send("Passwords don't match");
    const hashedPwd = await Passwd.toHash(newPassword);

    let user = await Student.findByIdAndUpdate(
      req.user?._id,
      { password: newPassword },
      { new: true }
    );
    debug(user?.password);
    // @ts-ignore
    user = await user?.save();
    debug(user?.password);
    return res.status(200).send("Password changed");
  } catch (error) {
    return res.status(500).send((error as Error).message);
  }
});

export { router as passwordChangeRouter };
