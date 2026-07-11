import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../database/connection.js';
import { config } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * Register a new user
 */
export const registerUser = async (userData) => {
  const { name, email, password } = userData;
  const pool = await db.getConnection();

  // Check if user already exists
  const checkUserQuery = await pool.request()
    .input('Email', email)
    .query('SELECT * FROM AMUserMaster WHERE Email = @Email');

  if (checkUserQuery.recordset.length > 0) {
    throw new ApiError(400, 'User with this email already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Insert into DB
  const insertResult = await pool.request()
    .input('FullName', name)
    .input('Email', email)
    .input('PasswordHash', hashedPassword)
    .query(`
      INSERT INTO AMUserMaster (FullName, Email, PasswordHash) 
      OUTPUT INSERTED.UserId, INSERTED.FullName, INSERTED.Email, INSERTED.CreatedAt, INSERTED.Role
      VALUES (@FullName, @Email, @PasswordHash)
    `);

  const user = insertResult.recordset[0];

  // Generate JWT token
  const token = jwt.sign({ id: user.UserId, role: user.Role }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });

  return { user, token };
};

/**
 * Login a user
 */
export const loginUser = async (credentials) => {
  const { email, password } = credentials;
  const pool = await db.getConnection();

  // Find user by email
  const userResult = await pool.request()
    .input('Email', email)
    .query('SELECT * FROM AMUserMaster WHERE Email = @Email');

  if (userResult.recordset.length === 0) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const user = userResult.recordset[0];

  // Check if active
  if (!user.IsActive) {
    throw new ApiError(401, 'User account is inactive');
  }

  // Compare passwords
  const isMatch = await bcrypt.compare(password, user.PasswordHash);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // Generate JWT token
  const token = jwt.sign({ id: user.UserId, role: user.Role }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });

  // Remove password from returned user object
  delete user.PasswordHash;

  return { user, token };
};
