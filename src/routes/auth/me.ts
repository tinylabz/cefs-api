import { Router, Request, Response } from "express";

import { DESIGNATIONS } from "../../Interfaces";
import { Student } from "../../models/Student";
import { Staff } from "../../models/Staff";
import { debug } from "../../utils/debug";
import { InternalServerError } from "../../errors";
import { requireAuth } from "../../middlewares";

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
      const err = new InternalServerError((error as Error).message);
      debug("ERROR: ", err);
      return res.status(err.statusCode).send(err.message);
    }

    debug("ME: ", JSON.stringify(me));

    return res.send({ me });
  }
);

export { router as currentUserRouter };
