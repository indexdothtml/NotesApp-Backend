import nodemailer from "nodemailer";

import { env } from "@/envConfig";

export const transport = nodemailer.createTransport({
  service: env.senderEmailService,
  auth: {
    user: env.senderEmailAddress,
    pass: env.senderEmailPassword,
  },
});
