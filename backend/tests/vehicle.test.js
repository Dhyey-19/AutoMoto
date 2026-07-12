import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../src/app.js';
import { db } from '../src/database/connection.js';
import jwt from 'jsonwebtoken';
import { config } from '../src/config/env.js';

// Mutate the imported db singleton for mocking
db.getConnection = jest.fn();

describe('Vehicle API Endpoints', () => {
  let adminToken, userToken;
  const vehicleId = 'v1';

  beforeAll(() => {
    adminToken = jwt.sign({ id: 'u1', role: 'ADMIN' }, config.jwt.secret, { expiresIn: '1h' });
    userToken = jwt.sign({ id: 'u2', role: 'USER' }, config.jwt.secret, { expiresIn: '1h' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // GET /api/vehicles
  describe('GET /api/vehicles', () => {
    it('should get all vehicles for authenticated user', async () => {
      const mockQuery = jest.fn().mockResolvedValue({ recordset: [{ VehicleId: vehicleId, Make: 'Toyota' }] });
      db.getConnection.mockResolvedValue({ request: () => ({ query: mockQuery }) });

      const res = await request(app).get('/api/vehicles').set('Authorization', `Bearer ${userToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
    });
  });

  // GET /api/vehicles/search
  describe('GET /api/vehicles/search', () => {
    it('should return search results', async () => {
      const mockQuery = jest.fn().mockResolvedValue({ recordset: [] });
      db.getConnection.mockResolvedValue({ request: () => ({ input: jest.fn().mockReturnThis(), query: mockQuery }) });

      const res = await request(app).get('/api/vehicles/search?make=Honda').set('Authorization', `Bearer ${userToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  // POST /api/vehicles
  describe('POST /api/vehicles', () => {
    const newVehicle = { Make: 'Toyota', Model: 'Camry', CategoryId: 1, ManufactureYear: 2022, Price: 25000, Quantity: 5 };

    it('should allow ADMIN to add a vehicle', async () => {
      const mockQuery = jest.fn().mockResolvedValue({ recordset: [{ VehicleId: vehicleId }] });
      db.getConnection.mockResolvedValue({ request: () => ({ input: jest.fn().mockReturnThis(), query: mockQuery }) });

      const res = await request(app).post('/api/vehicles').set('Authorization', `Bearer ${adminToken}`).send(newVehicle);
      expect(res.status).toBe(201);
    });

    it('should reject USER from adding a vehicle', async () => {
      const res = await request(app).post('/api/vehicles').set('Authorization', `Bearer ${userToken}`).send(newVehicle);
      expect(res.status).toBe(403);
    });
  });

  // PUT /api/vehicles/:id
  describe('PUT /api/vehicles/:id', () => {
    it('should update vehicle details', async () => {
      const mockQuery = jest.fn().mockResolvedValue({ recordset: [{ VehicleId: vehicleId }] });
      db.getConnection.mockResolvedValue({ request: () => ({ input: jest.fn().mockReturnThis(), query: mockQuery }) });

      const updateData = { Make: 'Honda', Model: 'Civic', CategoryId: 2, ManufactureYear: 2023, Price: 22000, Quantity: 10 };
      const res = await request(app).put(`/api/vehicles/${vehicleId}`).set('Authorization', `Bearer ${adminToken}`).send(updateData);
      expect(res.status).toBe(200);
    });
  });

  // DELETE /api/vehicles/:id
  describe('DELETE /api/vehicles/:id', () => {
    it('should soft delete a vehicle', async () => {
      const mockQuery = jest.fn().mockResolvedValue({ rowsAffected: [1] });
      db.getConnection.mockResolvedValue({ request: () => ({ input: jest.fn().mockReturnThis(), query: mockQuery }) });

      const res = await request(app).delete(`/api/vehicles/${vehicleId}`).set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
    });
  });

  // POST /api/vehicles/:id/purchase
  describe('POST /api/vehicles/:id/purchase', () => {
    it('should allow purchasing a vehicle', async () => {
      const mockQuery = jest.fn()
        .mockResolvedValueOnce({ recordset: [{ Price: 25000, Quantity: 5 }] })
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce({ recordset: [{ TransactionId: 'tx1' }] });
        
      const mockTransaction = { begin: jest.fn(), commit: jest.fn(), rollback: jest.fn(), request: () => ({ input: jest.fn().mockReturnThis(), query: mockQuery }) };
      db.getConnection.mockResolvedValue({ transaction: () => mockTransaction });

      const res = await request(app).post(`/api/vehicles/${vehicleId}/purchase`).set('Authorization', `Bearer ${userToken}`).send({ Quantity: 1 });
      expect(res.status).toBe(201);
    });
  });

  // POST /api/vehicles/:id/restock
  describe('POST /api/vehicles/:id/restock', () => {
    it('should allow ADMIN to restock a vehicle', async () => {
      const mockQuery = jest.fn()
        .mockResolvedValueOnce({ recordset: [{ Price: 25000 }] })
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce({ recordset: [{ TransactionId: 'tx2' }] });
        
      const mockTransaction = { begin: jest.fn(), commit: jest.fn(), rollback: jest.fn(), request: () => ({ input: jest.fn().mockReturnThis(), query: mockQuery }) };
      db.getConnection.mockResolvedValue({ transaction: () => mockTransaction });

      const res = await request(app).post(`/api/vehicles/${vehicleId}/restock`).set('Authorization', `Bearer ${adminToken}`).send({ Quantity: 5 });
      expect(res.status).toBe(201);
    });
  });
});