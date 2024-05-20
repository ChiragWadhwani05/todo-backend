import nodemailer from "nodemailer";
import { ApiError } from "./apiError.js";
import process from "node:process";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  service: process.env.SMTP_SERVICE,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

/**
 * @description Function to send mail
 *
 * @param {{email: string, subject: string, content: string}} options
 */
async function sendMail(options) {
  try {
    await transporter.sendMail({
      from: "todo@gmail.com",
      to: options.email,
      subject: options.subject,
      html: options.content,
    });
  } catch (error) {
    console.error("Error sending mail", error);
    throw new ApiError(500, "Failed to send mail");
  }
}

export { sendMail };
