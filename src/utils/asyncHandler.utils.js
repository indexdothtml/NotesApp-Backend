function asyncHandler(cbfn) {
  return async function (req, res, next) {
    try {
      await cbfn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

export default asyncHandler;
