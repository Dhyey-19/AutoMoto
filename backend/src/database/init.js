import { db } from './connection.js';
import { logger } from '../utils/logger.js';

export const initializeDatabase = async () => {
  try {
    const pool = await db.getConnection();
    
    // Schema creation/migration checks only (tables are preserved)

    // Create AMUserMaster table
    const createAMUserMasterQuery = `
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='AMUserMaster' and xtype='U')
      CREATE TABLE AMUserMaster
      (
          UserId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
          FullName VARCHAR(30) NOT NULL,
          Email VARCHAR(50) NOT NULL UNIQUE,
          PasswordHash VARCHAR(255) NOT NULL,
          Role VARCHAR(5) NOT NULL
              CHECK (Role IN ('ADMIN', 'USER'))
              DEFAULT 'USER',
          IsActive BIT NOT NULL DEFAULT 1,
          CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
          UpdatedAt DATETIME NOT NULL DEFAULT GETDATE()
      )
    `;
    await pool.request().query(createAMUserMasterQuery);

    // Create AMCategoryMaster table
    const createAMCategoryMasterQuery = `
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='AMCategoryMaster' and xtype='U')
      CREATE TABLE AMCategoryMaster
      (
          CategoryId INT IDENTITY(1,1) PRIMARY KEY,
          CategoryName VARCHAR(30) NOT NULL UNIQUE,
          IsActive BIT NOT NULL DEFAULT 1,
          CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
          UpdatedAt DATETIME NOT NULL DEFAULT GETDATE()
      )
    `;
    await pool.request().query(createAMCategoryMasterQuery);

    // Seed default categories
    const seedCategoriesQuery = `
      IF NOT EXISTS (SELECT 1 FROM AMCategoryMaster)
      BEGIN
          INSERT INTO AMCategoryMaster (CategoryName) VALUES ('SUV'), ('Sedan'), ('Truck'), ('Hatchback'), ('Coupe')
      END
    `;
    await pool.request().query(seedCategoriesQuery);

    // Create AMVehicleMaster table
    const createAMVehicleMasterQuery = `
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='AMVehicleMaster' and xtype='U')
      CREATE TABLE AMVehicleMaster
      (
          VehicleId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
          Make VARCHAR(50) NOT NULL,
          Model VARCHAR(50) NOT NULL,
          CategoryId INT NOT NULL,
          ManufactureYear SMALLINT NOT NULL,
          Color VARCHAR(30) NULL,
          Description VARCHAR(1000) NULL,
          Price DECIMAL(12,2) NOT NULL
              CHECK (Price >= 0),
          Quantity INT NOT NULL DEFAULT 0
              CHECK (Quantity >= 0),
          ImageUrl VARCHAR(500) NULL,
          IsActive BIT NOT NULL DEFAULT 1,
          CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
          UpdatedAt DATETIME NOT NULL DEFAULT GETDATE(),
          CONSTRAINT FK_AMVehicleMaster_Category
              FOREIGN KEY (CategoryId)
              REFERENCES AMCategoryMaster(CategoryId)
      )
    `;
    await pool.request().query(createAMVehicleMasterQuery);

    // Create AMInventoryTransaction table
    const createAMInventoryTransactionQuery = `
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='AMInventoryTransaction' and xtype='U')
      CREATE TABLE AMInventoryTransaction
      (
          TransactionId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
          VehicleId UNIQUEIDENTIFIER NOT NULL,
          UserId UNIQUEIDENTIFIER NOT NULL,
          TransactionType VARCHAR(10) NOT NULL
              CHECK (TransactionType IN ('PURCHASE', 'RESTOCK')),
          Quantity INT NOT NULL
              CHECK (Quantity > 0),
          VehiclePrice DECIMAL(12,2) NOT NULL,
          TotalAmount AS (Quantity * VehiclePrice) PERSISTED,
          Remarks VARCHAR(255) NULL,
          CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
          CONSTRAINT FK_AMInventoryTransaction_Vehicle
              FOREIGN KEY (VehicleId)
              REFERENCES AMVehicleMaster(VehicleId),
          CONSTRAINT FK_AMInventoryTransaction_User
              FOREIGN KEY (UserId)
              REFERENCES AMUserMaster(UserId)
      )
    `;
    await pool.request().query(createAMInventoryTransactionQuery);

    logger.info('Database initialized: New schemas successfully created.');
  } catch (error) {
    logger.error('Failed to initialize database tables:', error);
    throw error;
  }
};
