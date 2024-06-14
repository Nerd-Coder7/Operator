import ejs from 'ejs';
import nodemailer from 'nodemailer';
import { fileURLToPath } from 'url';
import path from 'path';
import { promises as fs } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function sendActivationEmail(email, activationLink) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      service: process.env.SMTP_SERVICE,
      port: parseInt(process.env.SMTP_PORT || '465', 10),
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const templatePath = path.join(__dirname, '..', 'mails', 'activation_mail.ejs');
    
    const emailTemplate = await fs.readFile(templatePath, 'utf-8');
    const renderedEmail = ejs.render(emailTemplate, {
      username:"dear",
      activationLink,
    }); 
console.log(renderedEmail);
    await transporter.sendMail({
      from: process.env.SMTP_EMAIL, 
      to: email,
      subject: 'Activate Your Account',
      html: renderedEmail,
    });

    return true;
  } catch (error) {
    console.error('Error sending activation email:', error);
    return false; 
  }
}
