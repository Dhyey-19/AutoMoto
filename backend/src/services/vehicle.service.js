import { db } from '../database/connection.js';
import { ApiError } from '../utils/ApiError.js';

export const getAllVehicles = async () => {
  const pool = await db.getConnection();
  const query = `
    SELECT 
      v.VehicleId, v.Make, v.Model, v.CategoryId, 
      c.CategoryName, v.ManufactureYear, v.Color, 
      v.Description, v.Price, v.Quantity, v.ImageUrl, 
      v.CreatedAt, v.UpdatedAt
    FROM AMVehicleMaster v
    JOIN AMCategoryMaster c ON v.CategoryId = c.CategoryId
    WHERE v.IsActive = 1
    ORDER BY v.CreatedAt DESC
  `;
  const result = await pool.request().query(query);
  return result.recordset;
};

export const searchVehicles = async (filters) => {
  const pool = await db.getConnection();
  let query = `
    SELECT 
      v.VehicleId, v.Make, v.Model, v.CategoryId, 
      c.CategoryName, v.ManufactureYear, v.Color, 
      v.Description, v.Price, v.Quantity, v.ImageUrl, 
      v.CreatedAt, v.UpdatedAt
    FROM AMVehicleMaster v
    JOIN AMCategoryMaster c ON v.CategoryId = c.CategoryId
    WHERE v.IsActive = 1
  `;
  
  const request = pool.request();

  if (filters.make) {
    query += ` AND v.Make LIKE '%' + @make + '%'`;
    request.input('make', filters.make);
  }
  if (filters.model) {
    query += ` AND v.Model LIKE '%' + @model + '%'`;
    request.input('model', filters.model);
  }
  if (filters.categoryId) {
    query += ` AND v.CategoryId = @categoryId`;
    request.input('categoryId', parseInt(filters.categoryId, 10));
  }
  if (filters.minPrice) {
    query += ` AND v.Price >= @minPrice`;
    request.input('minPrice', parseFloat(filters.minPrice));
  }
  if (filters.maxPrice) {
    query += ` AND v.Price <= @maxPrice`;
    request.input('maxPrice', parseFloat(filters.maxPrice));
  }
  if (filters.manufactureYear) {
    query += ` AND v.ManufactureYear = @manufactureYear`;
    request.input('manufactureYear', parseInt(filters.manufactureYear, 10));
  }
  if (filters.color) {
    query += ` AND v.Color LIKE '%' + @color + '%'`;
    request.input('color', filters.color);
  }

  query += ` ORDER BY v.CreatedAt DESC`;
  const result = await request.query(query);
  return result.recordset;
};

export const createVehicle = async (vehicleData) => {
  const pool = await db.getConnection();
  const query = `
    INSERT INTO AMVehicleMaster (
      Make, Model, CategoryId, ManufactureYear, Color, 
      Description, Price, Quantity, ImageUrl
    )
    OUTPUT 
      INSERTED.VehicleId, INSERTED.Make, INSERTED.Model, 
      INSERTED.CategoryId, INSERTED.ManufactureYear, 
      INSERTED.Color, INSERTED.Description, INSERTED.Price, 
      INSERTED.Quantity, INSERTED.ImageUrl, INSERTED.CreatedAt, INSERTED.UpdatedAt
    VALUES (
      @Make, @Model, @CategoryId, @ManufactureYear, @Color, 
      @Description, @Price, @Quantity, @ImageUrl
    )
  `;

  const request = pool.request();
  request.input('Make', vehicleData.Make);
  request.input('Model', vehicleData.Model);
  request.input('CategoryId', vehicleData.CategoryId);
  request.input('ManufactureYear', vehicleData.ManufactureYear);
  request.input('Color', vehicleData.Color || null);
  request.input('Description', vehicleData.Description || null);
  request.input('Price', vehicleData.Price);
  request.input('Quantity', vehicleData.Quantity);
  request.input('ImageUrl', vehicleData.ImageUrl || null);

  const result = await request.query(query);
  return result.recordset[0];
};

export const updateVehicle = async (vehicleId, vehicleData) => {
  const pool = await db.getConnection();
  const query = `
    UPDATE AMVehicleMaster SET
      Make = @Make,
      Model = @Model,
      CategoryId = @CategoryId,
      ManufactureYear = @ManufactureYear,
      Color = @Color,
      Description = @Description,
      Price = @Price,
      Quantity = @Quantity,
      ImageUrl = @ImageUrl,
      UpdatedAt = GETDATE()
    OUTPUT 
      INSERTED.VehicleId, INSERTED.Make, INSERTED.Model, 
      INSERTED.CategoryId, INSERTED.ManufactureYear, 
      INSERTED.Color, INSERTED.Description, INSERTED.Price, 
      INSERTED.Quantity, INSERTED.ImageUrl, INSERTED.CreatedAt, INSERTED.UpdatedAt
    WHERE VehicleId = @VehicleId AND IsActive = 1
  `;

  const request = pool.request();
  request.input('VehicleId', vehicleId);
  request.input('Make', vehicleData.Make);
  request.input('Model', vehicleData.Model);
  request.input('CategoryId', vehicleData.CategoryId);
  request.input('ManufactureYear', vehicleData.ManufactureYear);
  request.input('Color', vehicleData.Color || null);
  request.input('Description', vehicleData.Description || null);
  request.input('Price', vehicleData.Price);
  request.input('Quantity', vehicleData.Quantity);
  request.input('ImageUrl', vehicleData.ImageUrl || null);

  const result = await request.query(query);
  
  if (result.recordset.length === 0) {
    throw new ApiError(404, 'Vehicle not found or inactive');
  }

  return result.recordset[0];
};

export const softDeleteVehicle = async (vehicleId) => {
  const pool = await db.getConnection();
  const query = `
    UPDATE AMVehicleMaster SET
      IsActive = 0,
      UpdatedAt = GETDATE()
    WHERE VehicleId = @VehicleId AND IsActive = 1
  `;

  const request = pool.request();
  request.input('VehicleId', vehicleId);
  const result = await request.query(query);

  if (result.rowsAffected[0] === 0) {
    throw new ApiError(404, 'Vehicle not found or already inactive');
  }

  return true;
};

// Step 6: Implement /purchase and /restock in vehicle endpoints
export const purchaseVehicle = async (vehicleId, userId, quantity, remarks = null) => {
  const pool = await db.getConnection();
  const transaction = pool.transaction();

  try {
    await transaction.begin();

    // 1. Get vehicle to check stock and price
    const vehicleRequest = transaction.request();
    vehicleRequest.input('VehicleId', vehicleId);
    
    // We use UPDLOCK here to apply an exclusive lock on the specific vehicle row. 
    // This prevents race conditions if multiple users try to purchase the same vehicle simultaneously.
    const vehicleResult = await vehicleRequest.query(`
      SELECT Price, Quantity FROM AMVehicleMaster WITH (UPDLOCK) 
      WHERE VehicleId = @VehicleId AND IsActive = 1
    `);

    if (vehicleResult.recordset.length === 0) {
      throw new ApiError(404, 'Vehicle not found or inactive');
    }

    const vehicle = vehicleResult.recordset[0];

    if (vehicle.Quantity < quantity) {
      throw new ApiError(400, 'Insufficient stock');
    }

    // 2. Decrement stock
    const updateRequest = transaction.request();
    updateRequest.input('VehicleId', vehicleId);
    updateRequest.input('Quantity', quantity);
    await updateRequest.query(`
      UPDATE AMVehicleMaster 
      SET Quantity = Quantity - @Quantity, UpdatedAt = GETDATE() 
      WHERE VehicleId = @VehicleId
    `);

    // 3. Insert transaction record
    const insertRequest = transaction.request();
    insertRequest.input('VehicleId', vehicleId);
    insertRequest.input('UserId', userId);
    insertRequest.input('TransactionType', 'PURCHASE');
    insertRequest.input('Quantity', quantity);
    insertRequest.input('VehiclePrice', vehicle.Price);
    insertRequest.input('Remarks', remarks);
    
    const transResult = await insertRequest.query(`
      INSERT INTO AMInventoryTransaction (VehicleId, UserId, TransactionType, Quantity, VehiclePrice, Remarks)
      OUTPUT INSERTED.*
      VALUES (@VehicleId, @UserId, @TransactionType, @Quantity, @VehiclePrice, @Remarks)
    `);

    await transaction.commit();
    return transResult.recordset[0];
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const restockVehicle = async (vehicleId, userId, quantity, remarks = null) => {
  const pool = await db.getConnection();
  const transaction = pool.transaction();

  try {
    await transaction.begin();

    // 1. Get vehicle to check price and lock the row to avoid concurrent restock overrides
    const vehicleRequest = transaction.request();
    vehicleRequest.input('VehicleId', vehicleId);
    const vehicleResult = await vehicleRequest.query(`
      SELECT Price FROM AMVehicleMaster WITH (UPDLOCK) 
      WHERE VehicleId = @VehicleId AND IsActive = 1
    `);

    if (vehicleResult.recordset.length === 0) {
      throw new ApiError(404, 'Vehicle not found or inactive');
    }

    const vehicle = vehicleResult.recordset[0];

    // 2. Increment stock
    const updateRequest = transaction.request();
    updateRequest.input('VehicleId', vehicleId);
    updateRequest.input('Quantity', quantity);
    await updateRequest.query(`
      UPDATE AMVehicleMaster 
      SET Quantity = Quantity + @Quantity, UpdatedAt = GETDATE() 
      WHERE VehicleId = @VehicleId
    `);

    // 3. Insert transaction record
    const insertRequest = transaction.request();
    insertRequest.input('VehicleId', vehicleId);
    insertRequest.input('UserId', userId);
    insertRequest.input('TransactionType', 'RESTOCK');
    insertRequest.input('Quantity', quantity);
    insertRequest.input('VehiclePrice', vehicle.Price);
    insertRequest.input('Remarks', remarks);
    
    const transResult = await insertRequest.query(`
      INSERT INTO AMInventoryTransaction (VehicleId, UserId, TransactionType, Quantity, VehiclePrice, Remarks)
      OUTPUT INSERTED.*
      VALUES (@VehicleId, @UserId, @TransactionType, @Quantity, @VehiclePrice, @Remarks)
    `);

    await transaction.commit();
    return transResult.recordset[0];
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const getVehicleById = async (id) => {
  const pool = await db.getConnection();
  const query = `
    SELECT 
      v.VehicleId, v.Make, v.Model, v.CategoryId, 
      c.CategoryName, v.ManufactureYear, v.Color, 
      v.Description, v.Price, v.Quantity, v.ImageUrl, 
      v.CreatedAt, v.UpdatedAt
    FROM AMVehicleMaster v
    JOIN AMCategoryMaster c ON v.CategoryId = c.CategoryId
    WHERE v.VehicleId = @VehicleId AND v.IsActive = 1
  `;
  const result = await pool.request()
    .input('VehicleId', id)
    .query(query);
    
  if (result.recordset.length === 0) {
    throw new ApiError(404, 'Vehicle model not found.');
  }
  
  return result.recordset[0];
};

export const getAllTransactions = async (userId = null, role = 'USER') => {
  const pool = await db.getConnection();
  let query = `
    SELECT 
      t.TransactionId,
      t.VehicleId,
      t.UserId,
      t.TransactionType,
      t.Quantity,
      t.VehiclePrice,
      t.TotalAmount,
      t.Remarks,
      t.CreatedAt,
      v.Make + ' ' + v.Model AS VehicleName,
      c.CategoryName,
      u.FullName AS UserName
    FROM AMInventoryTransaction t
    JOIN AMVehicleMaster v ON t.VehicleId = v.VehicleId
    JOIN AMCategoryMaster c ON v.CategoryId = c.CategoryId
    JOIN AMUserMaster u ON t.UserId = u.UserId
  `;
  
  const request = pool.request();
  if (role !== 'ADMIN') {
    query += ` WHERE t.UserId = @userId`;
    request.input('userId', userId);
  }
  
  query += ` ORDER BY t.CreatedAt DESC`;
  const result = await request.query(query);
  return result.recordset;
};

export const getFeaturedVehicles = async () => {
  const pool = await db.getConnection();
  const query = `
    WITH RankedVehicles AS (
      SELECT 
        v.VehicleId, v.Make, v.Model, v.CategoryId, 
        c.CategoryName, v.ManufactureYear, v.Color, 
        v.Description, v.Price, v.Quantity, v.ImageUrl, 
        v.CreatedAt, v.UpdatedAt,
        ROW_NUMBER() OVER(PARTITION BY v.CategoryId ORDER BY v.Price DESC) as rn
      FROM AMVehicleMaster v
      JOIN AMCategoryMaster c ON v.CategoryId = c.CategoryId
      WHERE v.IsActive = 1
    )
    SELECT * FROM RankedVehicles WHERE rn = 1
    ORDER BY Price DESC
  `;
  const result = await pool.request().query(query);
  return result.recordset;
};

