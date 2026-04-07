import { connectDB } from "@/db/connections.db";
import app from "@/app";
import { env } from "@/envConfig";
import { logger } from "@/loggerConfig";
import { safeShutdown } from "@/utils/safeShutdown.utils";

connectDB().then(() => {
  const server = app.listen(env.port, () =>
    logger.info(`Server is listening on port ${env.port}`),
  );

  // Handles server starting error.
  server.on("error", async (error) => {
    logger.error(`Server listening failed with ${error}`);
    await safeShutdown();
  });

  // Handles graceful shutdown after process closed by ctrl + c in terminal.
  process.on("SIGINT", async () => await safeShutdown(server));

  // Handles graceful shutdown after process termination
  process.on("SIGTERM", async () => await safeShutdown(server));
});
