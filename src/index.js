import { connectDB } from "./db/connections.db.js";
import app from "./app.js";
import env from "./envConfig.js";
import logger from "./loggerConfig.js";
import safeShutdown from "./utils/safeShutdown.utils.js";

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
