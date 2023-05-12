import { Router, Request, Response } from "express";

import { requireAuth } from "../../middlewares/require-auth";
import { DESIGNATIONS } from "../../Interfaces";
import { Student } from "../../models/Student";
import { Staff } from "../../models/Staff";
import { debug } from "../../utils/debug";

const router = Router().get(
  "/",
  requireAuth,
  async (req: Request, res: Response) => {
    const ds = req.user?.designation;
    let me;
    try {
      if (ds === DESIGNATIONS.STUDENT) {
        me = await Student.findById(req.user?._id);
      } else {
        me = await Staff.findById(req.user?._id);
      }
    } catch (error) {
      debug("ERROR: ", error);
    }

    debug("ME: ", JSON.stringify(me));

    return res.status(200).send({ me });
  }
);

export { router as currentUserRouter };
