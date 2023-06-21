import { Router, Response, Request } from "express";
import { Student } from "../../models/Student";
import { debug } from "../../utils/debug";
import { InternalServerError } from "../../errors";
import { Staff } from "../../models/Staff";
import { validateObjectID } from "../../middlewares";

const router = Router();

const buttonHTML = `<a href="https://cefs.vercel.app" class="centered-button">Email verified, click this button to continue</a>`;
const htmlResponse = `
    <html>
      <head>
        <style>

        body{
          height:100vh;
          widht:100vw;
          display:flex;
          justify-content:center;
          align-items:center;
        }
          .centered-button {
            display: block;
            margin: 0 auto;
            text-align: center;
            padding: 10px 20px;
            background-color: #2F855A;
            color: white;
            border: none;
            width:20%;
            border-radius: 4px;
            cursor: pointer;
            text-decoration: none;
          }
          .centered-button:hover {
            background-color: #38A169;
          }
        </style>
      </head>
      <body>
        ${buttonHTML}
      </body>
    </html>
  `;

router.get(
  "/students/:id",
  validateObjectID,
  async (req: Request, res: Response) => {
    try {
      const student = await Student.findByIdAndUpdate(
        req.params.id,
        { isEmailVerified: true },
        { new: true }
      );

      debug("Email verified :", student);
      return res.send(htmlResponse);
    } catch (error) {
      const err = new InternalServerError((error as Error).message);
      return res.status(err.statusCode).send(err.message);
    }
  }
);

router.get(
  "/staff/:id",
  validateObjectID,
  async (req: Request, res: Response) => {
    try {
      const staff = await Staff.findByIdAndUpdate(
        req.params.id,
        { isEmailVerified: true },
        { new: true }
      );

      debug("Email verified :", staff);
      return res.send(htmlResponse);
    } catch (error) {
      const err = new InternalServerError((error as Error).message);
      return res.status(err.statusCode).send(err.message);
    }
  }
);

export { router as verifyEmailRouter };
