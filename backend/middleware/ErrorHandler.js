const notFound = (req, res, next) => {
  let error = {};
  error.statusCode = 404;
  error.message = `NotFound: ${req?.originalUrl || ""}`;

  next(error);
};

const errorHandler = (err, req, res, next) => {
  console.log("ERROR", err);
  const statusCode = err.statusCode === 200 ? 500 : err.statusCode;
  // res.status(statusCode);
  res.status(statusCode).json({
    message: err.message || "Something went wrong!",
    stack: process.env.NODE_ENV === "production" ? null : err?.stack,
    statusCode,
  });
};

module.exports = {
  errorHandler,
  notFound,
};
