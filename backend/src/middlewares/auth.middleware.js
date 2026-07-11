import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * Middleware to protect routes that require authentication
 */
export const authenticate = (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new ApiError(401, 'Not authorized to access this route');
    }

    const decoded = jwt.verify(token, config.jwt.secret);

    // Attach user ID to the request
    req.user = { id: decoded.id };
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      next(new ApiError(401, 'Token has expired'));
    } else if (error.name === 'JsonWebTokenError') {
      next(new ApiError(401, 'Invalid token'));
    } else {
      next(error);
    }
  }
};
