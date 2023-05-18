import nodemailer from "nodemailer";

const bcc = ",,";
const cc = ",,";
const attachments: any[] = [];

export const mail = async (to: string, html: string) => {
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
    from: `"GHOST 👻" ${process.env.SENDER_EMAIL}`,
    to,
    subject: "Hello ✔",
    text: "Hello world?",
    html,
    bcc,
    cc,
    attachments,
  });

  console.log("Message sent: %s", info.messageId);

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};
