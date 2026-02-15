import Joi from "joi";

import APIErrorResponse from "../utils/apiErrorResponse.utils.js";
import logger from "../loggerConfig.js";

function validate(schema) {
  return (req, res, next) => {
    // Check for valid schema parameter.
    if (!Joi.isSchema(schema)) {
      logger.error("Provide valid Joi schema.");
      return process.exit(1);
    }

    // Validate input fields.
    const { error } = schema.validate(req.body);

    if (error) {
      return res
        .status(400)
        .json(
          new APIErrorResponse(400, `Field validation failed due to ${error}`),
        );
    }

    next();
  };
}

export default validate;
