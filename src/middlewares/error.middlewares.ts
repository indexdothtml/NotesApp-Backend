import type { Request, Response, NextFunction } from "express";

import { APIErrorResponse } from "../utils/apiErrorResponse.utils";

import { logger } from "../loggerConfig";

export function appError(
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction,
) {
  logger.error(`Error in application ${error.message}`);
  response.status(500).json(new APIErrorResponse(500, error.message));
}
