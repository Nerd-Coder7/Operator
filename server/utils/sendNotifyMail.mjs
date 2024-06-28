import ejs from "ejs";
import nodemailer from "nodemailer";
import { promises as fs } from "fs";



export default async function sendNotifyEmail(email,templatePath, redirectLink,subject) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      service: process.env.SMTP_SERVICE,
      port: parseInt(process.env.SMTP_PORT || "465", 10),
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const emailTemplate = await fs.readFile(templatePath, "utf-8");
    const renderedEmail = ejs.render(emailTemplate, {
      redirectLink,
    });
    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: subject,
      html: renderedEmail,
    });

    return true;
  } catch (error) {
    console.error("Error sending eval email:", error);
    return false;
  }
}
