import jwt from "jsonwebtoken";

import APIErrorResponse from "../utils/apiErrorResponse.utils.js";
import env from "../envConfig.js";

const verifyAuth = (req, res, next) => {
  // Get accessToken either from cookies (in case of browser) or
  // from authorization header with bearer token (in case of other frontends like mobile app which don't use browser)
  const accessToken =
    req?.cookies?.accessToken ||
    req?.headers?.authorization?.replace("Bearer ", "");

  if (!accessToken) {
    return res
      .status(401)
      .json(
        new APIErrorResponse(
          401,
          "User is not authorized to perfrom this action.",
        ),
      );
  }

  // Verify accessToken.
  try {
    const decodedPayload = jwt.verify(accessToken, env.accessTokenSecret);
    req.user = decodedPayload;
  } catch (error) {
    return res
      .status(401)
      .json(
        new APIErrorResponse(401, `Token verification failed due to ${error}`),
      );
  }

  next();
};

export default verifyAuth;
