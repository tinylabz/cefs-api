import { Request, Response, Router } from "express";
import { mail } from "../utils/mailer";
import { debug } from "../utils/debug";
import { requireAuth } from "../middlewares";

const router = Router();

router.get("/", requireAuth, async (req: Request, res: Response) => {
  mail(
    `${req.user?.email},'',''`,
    `<a
      href="http://localhost:4000/api/verify-email/students/${req.user?._id}"
      style="text-decoration: none;"
    >
      <button style="display: inline-block; cursor: pointer; font-size: 16px; font-weight: bold; text-align: center; text-decoration: none; border-radius: 4px; padding: 10px 20px; border: none; background-color: #4CAF50; color: white;">
        Verify Email
      </button>
    </a>`,
    "Email Verification",
    "Click this button to complete your verifcation"
  )
    .then(() => {
      return res
        .status(200)
        .send(`Verification Email Sent to ${req.user?.email}`);
    })
    .catch((err) => {
      debug("ERROR: ", err);
      return res.status(500).send((err as Error).message);
    });
});

export { router as mailRouter };
