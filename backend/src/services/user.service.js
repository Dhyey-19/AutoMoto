import { db } from '../database/connection.js';
import { ApiError } from '../utils/ApiError.js';
import bcrypt from 'bcrypt';

export const getAllUsers = async () => {
  const pool = await db.getConnection();
  const result = await pool.request().query(`
    SELECT UserId, FullName, Email, Role, IsActive, CreatedAt 
    FROM AMUserMaster 
    ORDER BY CreatedAt DESC
  `);
  return result.recordset;
};

export const updateUserRole = async (userId, role) => {
  if (role !== 'ADMIN' && role !== 'USER') {
    throw new ApiError(400, 'Invalid role tier specified.');
  }

  const pool = await db.getConnection();
  const result = await pool.request()
    .input('UserId', userId)
    .input('Role', role)
    .query(`
      UPDATE AMUserMaster 
      SET Role = @Role, UpdatedAt = GETDATE() 
      OUTPUT INSERTED.UserId, INSERTED.FullName, INSERTED.Email, INSERTED.Role
      WHERE UserId = @UserId
    `);

  if (result.recordset.length === 0) {
    throw new ApiError(404, 'User account not found.');
  }

  return result.recordset[0];
};

export const updateUserStatus = async (userId, isActive) => {
  const pool = await db.getConnection();
  const result = await pool.request()
    .input('UserId', userId)
    .input('IsActive', isActive ? 1 : 0)
    .query(`
      UPDATE AMUserMaster 
      SET IsActive = @IsActive, UpdatedAt = GETDATE() 
      OUTPUT INSERTED.UserId, INSERTED.FullName, INSERTED.Email, INSERTED.IsActive
      WHERE UserId = @UserId
    `);

  if (result.recordset.length === 0) {
    throw new ApiError(404, 'User account not found.');
  }

  return result.recordset[0];
};

export const createUserByAdmin = async (userData) => {
  const { name, email, password, role } = userData;
  const pool = await db.getConnection();

  // Check email
  const checkEmail = await pool.request()
    .input('Email', email)
    .query('SELECT 1 FROM AMUserMaster WHERE Email = @Email');

  if (checkEmail.recordset.length > 0) {
    throw new ApiError(400, 'User with this email already exists.');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const result = await pool.request()
    .input('FullName', name)
    .input('Email', email)
    .input('PasswordHash', hashedPassword)
    .input('Role', role)
    .query(`
      INSERT INTO AMUserMaster (FullName, Email, PasswordHash, Role)
      OUTPUT INSERTED.UserId, INSERTED.FullName, INSERTED.Email, INSERTED.Role, INSERTED.IsActive, INSERTED.CreatedAt
      VALUES (@FullName, @Email, @PasswordHash, @Role)
    `);

  return result.recordset[0];
};
