import env from "./envConfig.js";

export const dbName = "notesapp";

export const corsOptions = {
  origin: env.origin,
  credentials: true,
};
