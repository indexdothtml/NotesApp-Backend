import APIErrorResponse from "../utils/apiErrorResponse.utils.js";

import logger from "../loggerConfig.js";

const appError = (err, req, res, next) => {
  logger.error(`Application failed with ${err}`);
  return res.status(500).json(new APIErrorResponse(500, err.message));
};

export default appError;
