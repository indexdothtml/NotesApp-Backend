const env = {
  dbURI: process.env.DB_URI,
  nodeEnv: process.env.NODE_ENV,
  port: process.env.PORT,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY,
  origin: process.env.ORIGIN,
  senderEmailAddress: process.env.SENDER_EMAIL_ADDRESS,
  senderEmailPassword: process.env.SENDER_EMAIL_PASSWORD,
  senderEmailService: process.env.SENDER_EMAIL_SERVICE,
};

export default env;
