import { logger } from '../utils/logger.js';
import { ApiError } from '../utils/ApiError.js';
import { config } from '../config/env.js';

export const notFound = (req, res, next) => {
  const error = new ApiError(404, `Not Found - ${req.originalUrl}`);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Something went wrong.';
    error = new ApiError(statusCode, message, false, err.stack);
  }

  const response = {
    success: false,
    message: error.message,
    ...(config.env === 'development' && { stack: error.stack }),
  };

  if (error.statusCode >= 500) {
    logger.error(`${error.statusCode} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  }

  res.status(error.statusCode).json(response);
};
