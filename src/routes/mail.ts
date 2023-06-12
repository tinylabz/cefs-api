import { Request, Response, Router } from "express";
import { sendMail } from "../services/mail";
import { debug } from "../utils/debug";
import { requireAuth } from "../middlewares";
import { DESIGNATIONS } from "../Interfaces";

const router = Router();

router.get("/", requireAuth, async (req: Request, res: Response) => {
  const entity =
    req.user?.designation === DESIGNATIONS.STUDENT ? "students" : "staff";

  const html = `<a
      href="http://localhost:4000/api/verify-email/${entity}/${req.user?._id}"
      style="text-decoration: none;"
    >
      <button style="display: inline-block; cursor: pointer; font-size: 16px; font-weight: bold; text-align: center; text-decoration: none; border-radius: 4px; padding: 10px 20px; border: none; background-color: #4CAF50; color: white;">
        Verify Email
      </button>
    </a>`;

  sendMail(
    `${req.user?.email},'',''`,
    html,
    "Email Verification",
    "Click this button to complete your verifcation"
  )
    .then(() => {
      return res.send(`Verification Email Sent to ${req.user?.email}`);
    })
    .catch((err) => {
      debug("ERROR: ", err);
      return res.status(500).send((err as Error).message);
    });
});

export { router as mailRouter };
