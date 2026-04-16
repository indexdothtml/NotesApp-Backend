import type { Request, Response, NextFunction } from "express";

import { logger } from "../loggerConfig";

export function asyncHandler(
  cbfn: (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => Promise<Response>,
) {
  return async function (
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      await cbfn(request, response, next);
    } catch (error) {
      logger.error(`Error in controller ${error}`);
      next(error);
    }
  };
}
