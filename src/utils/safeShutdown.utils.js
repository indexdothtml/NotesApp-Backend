import { disconnectDB } from "../db/connections.db.js";
import logger from "../loggerConfig.js";

async function safeShutdown(server) {
  logger.info("Safely closing database connection and server.");
  await disconnectDB();
  if (server) {
    server?.close(() => {
      logger.info("Server is stopped listening.");
      process.exit(0);
    });
  }
}

export default safeShutdown;
