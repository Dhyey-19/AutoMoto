import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../src/app.js';
import { db } from '../src/database/connection.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Mutate the imported db singleton for mocking
db.getConnection = jest.fn();

describe('Auth API Endpoints', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      // Mock user doesn't exist
      const mockQuery = jest.fn()
        .mockResolvedValueOnce({ recordset: [] }) // Check user
        .mockResolvedValueOnce({ recordset: [{ UserId: 'u1', FullName: 'Test', Email: 't@t.com', Role: 'USER' }] }); // Insert user
        
      db.getConnection.mockResolvedValue({ request: () => ({ input: jest.fn().mockReturnThis(), query: mockQuery }) });

      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Test', email: 'test@example.com', password: 'password123' });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
    });

    it('should return 400 if user already exists', async () => {
      const mockQuery = jest.fn().mockResolvedValue({ recordset: [{ UserId: 'u1' }] });
      db.getConnection.mockResolvedValue({ request: () => ({ input: jest.fn().mockReturnThis(), query: mockQuery }) });

      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Test', email: 'test@example.com', password: 'password123' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login an existing user', async () => {
      const hashedPass = await bcrypt.hash('password123', 10);
      const mockQuery = jest.fn().mockResolvedValue({ 
        recordset: [{ UserId: 'u1', Email: 'test@example.com', PasswordHash: hashedPass, IsActive: 1, Role: 'USER' }] 
      });
      db.getConnection.mockResolvedValue({ request: () => ({ input: jest.fn().mockReturnThis(), query: mockQuery }) });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
    });
  });
});