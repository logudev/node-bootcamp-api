const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = {
    message: err.message,
    statusCode: err.statusCode,
  };

  // Mongoose Bad Object ID => Cast Error
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose Validation Error
  else if (err.name === 'ValidationError') {
    const errorValues = Object.values(err.errors);
    const messages = errorValues.map((value) => value.message);
    error = new ErrorResponse(messages, 400);
  }

  // Mongoose Duplicate Key error
  else if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
  });
};

module.exports = errorHandler;
