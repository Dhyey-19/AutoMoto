import { db } from '../database/connection.js';
import { config } from '../config/env.js';

export const getHealth = async (req, res) => {
  let isDbConnected = false;
  
  try {
    const pool = await db.getConnection();
    await pool.request().query('SELECT 1');
    isDbConnected = true;
  } catch (error) {
    isDbConnected = false;
  }

  if (isDbConnected) {
    return res.status(200).json({
      success: true,
      status: 'UP',
      database: 'CONNECTED',
      environment: config.env,
      uptime: Math.round(process.uptime()),
      timestamp: new Date().toISOString()
    });
  } else {
    return res.status(503).json({
      success: false,
      status: 'DOWN',
      database: 'DISCONNECTED'
    });
  }
};
