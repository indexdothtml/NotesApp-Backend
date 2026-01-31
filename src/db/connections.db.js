import mongoose from "mongoose";

import env from "../envConfig.js";
import { dbName } from "../constant.js";
import logger from "../loggerConfig.js";

async function connectDB() {
  try {
    await mongoose.connect(`${env.dbURI}/${dbName}`);
    logger.info("MongoDB connection success");
  } catch (error) {
    logger.error(`MongoDB connection failed with ${error}`);
    process.exit(1);
  }
}

async function disconnectDB() {
  try {
    await mongoose.disconnect();
    logger.info("MongoDB connection closed");
  } catch (error) {
    logger.error(`MongoDB disconnection failed with ${error}`);
    process.exit(1);
  }
}

export { connectDB, disconnectDB };
