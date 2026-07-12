import { db } from '../database/connection.js';
import { ApiError } from '../utils/ApiError.js';

export const getAllCategories = async () => {
  const pool = await db.getConnection();
  const result = await pool.request().query(`
    SELECT CategoryId, CategoryName, IsActive 
    FROM AMCategoryMaster 
    WHERE IsActive = 1 
    ORDER BY CategoryName ASC
  `);
  return result.recordset;
};

export const createCategory = async (categoryName) => {
  const pool = await db.getConnection();
  
  // Check if category already exists
  const checkResult = await pool.request()
    .input('CategoryName', categoryName)
    .query('SELECT 1 FROM AMCategoryMaster WHERE CategoryName = @CategoryName');
    
  if (checkResult.recordset.length > 0) {
    throw new ApiError(400, `Category '${categoryName}' already exists.`);
  }

  const result = await pool.request()
    .input('CategoryName', categoryName)
    .query(`
      INSERT INTO AMCategoryMaster (CategoryName) 
      OUTPUT INSERTED.CategoryId, INSERTED.CategoryName
      VALUES (@CategoryName)
    `);
    
  return result.recordset[0];
};
