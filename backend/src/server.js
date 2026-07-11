import app from './app.js';
import { config } from './config/env.js';
import { logger } from './utils/logger.js';
import { db } from './database/connection.js';

const startServer = async () => {
  try {
    // Attempt database connection but don't fail server startup if it fails initially
    // as per health check requirements to show "DOWN" if disconnected
    try {
      await db.connect();
    } catch (dbError) {
      logger.error('Initial database connection failed. Health check will report DOWN.', dbError.message);
    }

    const server = app.listen(config.port, () => {
      logger.info(`Server running in ${config.env} mode on port ${config.port}`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      logger.error('UNHANDLED REJECTION! 💥 Shutting down...', err);
      server.close(() => {
        process.exit(1);
      });
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (err) => {
      logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...', err);
      process.exit(1);
    });

    // Handle SIGTERM
    process.on('SIGTERM', () => {
      logger.info('👋 SIGTERM RECEIVED. Shutting down gracefully');
      server.close(() => {
        logger.info('💥 Process terminated!');
      });
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
