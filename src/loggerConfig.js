import winston from "winston";

import env from "./envConfig.js";

// Logger configuration
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
});

// Configuration specific to development environment
if (env.nodeEnv === "development") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  );
}

// Configuration specific to production environment
if (env.nodeEnv === "production") {
  logger.add(
    new winston.transports.File({ dirname: "./logs", filename: "app.log" }),
  );
}

export default logger;
