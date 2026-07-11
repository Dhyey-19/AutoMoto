import { db } from './connection.js';
import { logger } from '../utils/logger.js';

export const initializeDatabase = async () => {
  try {
    const pool = await db.getConnection();
    
    // Create Users table if it does not exist
    const createUsersTableQuery = `
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Users' and xtype='U')
      CREATE TABLE Users (
          id INT IDENTITY(1,1) PRIMARY KEY,
          name NVARCHAR(100) NOT NULL,
          email NVARCHAR(255) UNIQUE NOT NULL,
          password NVARCHAR(255) NOT NULL,
          created_at DATETIME DEFAULT GETDATE()
      )
    `;
    
    await pool.request().query(createUsersTableQuery);
  } catch (error) {
    logger.error('Failed to initialize database tables:', error);
    throw error;
  }
};
