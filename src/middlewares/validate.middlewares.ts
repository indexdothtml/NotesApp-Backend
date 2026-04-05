import Joi, { type ObjectSchema } from "joi";
import type { Request, Response, NextFunction } from "express";

import { APIErrorResponse } from "../utils/apiErrorResponse.utils";
import { logger } from "../loggerConfig";

export function validate(schema: ObjectSchema) {
  return (request: Request, response: Response, next: NextFunction) => {
    // Check for valid schema parameter.
    if (!Joi.isSchema(schema)) {
      logger.error("Provide valid Joi schema.");
      return process.exit(1);
    }

    // Validate input fields.
    const { error } = schema.validate(request.body);

    if (error) {
      return response
        .status(400)
        .json(
          new APIErrorResponse(400, `Field validation failed due to ${error}`),
        );
    }

    next();
  };
}
