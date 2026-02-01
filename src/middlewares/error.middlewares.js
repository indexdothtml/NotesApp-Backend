import APIErrorResponse from "../utils/apiErrorResponse.utils.js";

const appError = (err, req, res, next) => {
  return res.status(500).json(new APIErrorResponse(500, err.message));
};

export default appError;
