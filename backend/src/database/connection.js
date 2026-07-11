import sql from 'mssql';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';

const dbConfig = {
  user: config.db.user,
  password: config.db.password,
  server: config.db.server,
  database: config.db.database,
  port: config.db.port,
  options: {
    encrypt: config.db.encrypt,
    trustServerCertificate: config.db.trustServerCertificate,
    enableArithAbort: true,
    connectTimeout: 30000,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

class Database {
  constructor() {
    this.pool = null;
  }

  async connect() {
    try {
      if (this.pool) {
        return this.pool;
      }
      logger.info('Connecting to Azure SQL Database...');
      this.pool = await sql.connect(dbConfig);
      logger.info('Successfully connected to database');
      
      this.pool.on('error', err => {
        logger.error('Database pool error', err);
        this.pool = null; // Reset pool on error to allow reconnect
      });

      return this.pool;
    } catch (error) {
      logger.error('Failed to connect to database', error);
      this.pool = null;
      throw error;
    }
  }

  async getConnection() {
    if (!this.pool) {
      return await this.connect();
    }
    return this.pool;
  }

  async close() {
    try {
      if (this.pool) {
        await this.pool.close();
        this.pool = null;
        logger.info('Database connection closed');
      }
    } catch (error) {
      logger.error('Error closing database connection', error);
    }
  }
}

// Export singleton instance
export const db = new Database();
