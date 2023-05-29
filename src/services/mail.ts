import nodemailer from "nodemailer";
import { debug } from "../utils/debug";

const bcc = ",,";
const cc = ",,";
const attachments: any[] = [];

export const sendMail = async (
  to: string,
  html: string,
  subject: string,
  text: string
) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.APP_PASSWORD,
    },
  });

  let info = await transporter.sendMail({
    from: `"FROM CEFS 👻" ${process.env.SENDER_EMAIL}`,
    to,
    subject,
    text,
    html,
    bcc,
    cc,
    attachments,
  });

  debug("Message sent: %s", info.messageId);

  debug("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};
