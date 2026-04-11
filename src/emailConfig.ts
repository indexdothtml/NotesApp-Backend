import nodemailer from "nodemailer";

import { env } from "@/envConfig";

export const transporter = nodemailer.createTransport({
  host: env.smtpHost,
  secure: false, // for default port true for setting other port it should be false
  port: Number(env.smtpPort),
  auth: {
    user: env.emailUsername,
    pass: env.emailPassword,
  },
});
