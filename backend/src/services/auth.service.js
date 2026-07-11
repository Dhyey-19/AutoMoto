import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../database/connection.js';
import { config } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * Register a new user
 */
export const registerUser = async (name, email, password) => {
  const pool = await db.getConnection();
  
  // Check if user already exists
  const userExistsResult = await pool.request()
    .input('email', email)
    .query('SELECT id FROM Users WHERE email = @email');

  if (userExistsResult.recordset.length > 0) {
    throw new ApiError(400, 'User with this email already exists');
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Insert into DB
  const insertResult = await pool.request()
    .input('name', name)
    .input('email', email)
    .input('password', hashedPassword)
    .query(`
      INSERT INTO Users (name, email, password) 
      OUTPUT INSERTED.id, INSERTED.name, INSERTED.email, INSERTED.created_at
      VALUES (@name, @email, @password)
    `);

  const user = insertResult.recordset[0];

  // Generate JWT token
  const token = jwt.sign({ id: user.id }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });

  return { user, token };
};

/**
 * Login a user
 */
export const loginUser = async (email, password) => {
  const pool = await db.getConnection();

  // Find user by email
  const userResult = await pool.request()
    .input('email', email)
    .query('SELECT * FROM Users WHERE email = @email');

  if (userResult.recordset.length === 0) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const user = userResult.recordset[0];

  // Verify password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // Generate JWT token
  const token = jwt.sign({ id: user.id }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });

  // Remove password from response
  delete user.password;

  return { user, token };
};
