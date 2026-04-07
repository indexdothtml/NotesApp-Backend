import { transport } from "@/emailConfig";
import { logger } from "@/loggerConfig";
import { env } from "@/envConfig";

export async function sendEmail(to: string, subject: string, body: string) {
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
