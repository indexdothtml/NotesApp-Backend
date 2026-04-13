import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

import { APIErrorResponse } from "../utils/apiErrorResponse.utils";
import { env } from "../envConfig";
import { logger } from "../loggerConfig";

export function verifyAuth(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  // Get accessToken either from cookies (in case of browser) or
  // from authorization header with bearer token (in case of other frontends like mobile app which don't use browser)
  const accessToken =
    request?.cookies?.accessToken ||
    request?.headers?.authorization?.replace("Bearer ", "");

  if (!accessToken) {
    return response
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
    if (!env.accessTokenSecret) {
      logger.error(
        "Failed to load Access token secret from environment variable.",
      );
      return response
        .status(500)
        .json(new APIErrorResponse(500, "Something went wrong!"));
    }

    const decodedPayload = jwt.verify(accessToken, env.accessTokenSecret) as {
      _id: string;
    };

    request.user = { _id: decodedPayload._id };
  } catch (error) {
    return response
      .status(401)
      .json(
        new APIErrorResponse(401, `Token verification failed due to ${error}`),
      );
  }

  next();
}
