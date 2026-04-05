import type { Server } from "node:http";
import { disconnectDB } from "../db/connections.db";
import { logger } from "../loggerConfig";

export async function safeShutdown(server?: Server) {
  logger.info("Safely closing database connection and server.");
  await disconnectDB();
  if (server) {
    server?.close(() => {
      logger.info("Server is stopped listening.");
      process.exit(0);
    });
  }
}
