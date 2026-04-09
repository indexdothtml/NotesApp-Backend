import { createClient, type RedisClientType, type RedisModules } from "redis";

import { env } from "@/envConfig";
import { logger } from "@/loggerConfig";

const redisClient = createClient({ url: `${env.redisClientURL}` }).on(
  "error",
  (error) => {
    logger.error(`Redis failed to connect due to ${error}`);
    process.exit(1);
  },
);

export let redis: typeof redisClient | null = null;

export async function connectRedis() {
  redis = await redisClient.connect();
  logger.info("Redis connected!");
  return redis;
}

export function disconnectRedis() {
  redisClient.destroy();
  logger.info("Redis disconnected!");
}
