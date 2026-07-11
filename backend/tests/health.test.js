import request from 'supertest';
import app from '../src/app.js';
import { db } from '../src/database/connection.js';

// Mock the database connection module
jest.mock('../src/database/connection.js', () => {
  return {
    db: {
      getConnection: jest.fn()
    }
  };
});

describe('GET /api/v1/health', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 and UP status when database is connected', async () => {
    // Mock successful database connection and query
    const mockQuery = jest.fn().mockResolvedValue({ recordset: [{ '': 1 }] });
    db.getConnection.mockResolvedValue({ request: () => ({ query: mockQuery }) });

    const response = await request(app).get('/api/v1/health');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.status).toBe('UP');
    expect(response.body.database).toBe('CONNECTED');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('uptime');
  });

  it('should return 503 and DOWN status when database connection fails', async () => {
    // Mock failed database connection
    db.getConnection.mockRejectedValue(new Error('Connection failed'));

    const response = await request(app).get('/api/v1/health');

    expect(response.status).toBe(503);
    expect(response.body.success).toBe(false);
    expect(response.body.status).toBe('DOWN');
    expect(response.body.database).toBe('DISCONNECTED');
    expect(response.body).not.toHaveProperty('timestamp');
  });
});
