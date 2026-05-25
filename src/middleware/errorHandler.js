const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";

  if (err.code === "23505") {
    statusCode = 409;
    message = "Duplicate entry";
  }

  if (err.code === "22P02") {
    statusCode = 400;
    message = "Invalid input";
  }

  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Invalid token";
  }

  console.error(err);

  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;
