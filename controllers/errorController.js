const AppError = require("../utils/appError");

const handleCastErrorDB = (err) => {
  const message = ` invalid ${err.path}: ${err.value}. `;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
  });
};

const sendErrorProd = (err, res) => {
  console.log(err.isOperational);
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // console.error('Error', err);

    res.status(500).json({
      status: "error",
      message: "something went wrong",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = JSON.parse(JSON.stringify(err));

    if (error.name === "CastError") error = handleCastErrorDB(error);
    // if (error.code === 11000) error = handleDuplicate(error);

    sendErrorProd(error, res);
  }
};
