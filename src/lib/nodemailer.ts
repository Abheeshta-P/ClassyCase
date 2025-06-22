import { ADMIN_EMAIL, EMAIL_PASSWORD } from "@/app/config/config";
import nodemailer from "nodemailer";

// Configure Nodemailer transporter for Gmail
export const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: ADMIN_EMAIL,
    pass: EMAIL_PASSWORD, 
  },
});
