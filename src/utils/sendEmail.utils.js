import transport from "../emailConfig.js";
import logger from "../loggerConfig.js";
import env from "../envConfig.js";

async function sendEmail(to, subject, body) {
  try {
    await transport.sendMail({
      from: env.senderEmailAddress,
      to,
      subject,
      text: body,
    });
    return true;
  } catch (error) {
    logger.error(`Failed to send email due to ${error}`);
    return false;
  }
}

export default sendEmail;
