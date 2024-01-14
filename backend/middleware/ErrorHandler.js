const notFound = (req, res, next) => {
  console.log("NOT FOUND REQUEST", req);
  const error = "";
  // const error = new Error(`NotFound: ${req?.originalURL || ""}`);
  error.statusCode = 404;
  error.msg = `NotFound: ${req?.originalURL || ""}`;
  // res.status(404);
  next(error);
};

const errorHandler = (
  err = { statusCode: 500, msg: "Something went wrong!", stack: "" },
  req,
  res,
  next
) => {
  console.log("ERROR HANDLER", err);
  const statusCode = err.statusCode === 200 ? 500 : err.statusCode;
  res.status(statusCode);
  res.status(statusCode).json({
    message: err?.message || "Something went wrong!",
    stack: process.env.NODE_ENV === "production" ? null : err?.stack,
    statusCode,
  });
};

module.exports = {
  errorHandler,
  notFound,
};
