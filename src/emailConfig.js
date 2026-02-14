import nodemailer from "nodemailer";

import env from "./envConfig.js";

const transport = nodemailer.createTransport({
  service: env.senderEmailService,
  auth: {
    user: env.senderEmailAddress,
    pass: env.senderEmailPassword,
  },
});

export default transport;
