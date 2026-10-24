/**
 * Health Check Controller
 * Verifies Node.js HTTP server state, system memory, uptime, and database connection status
 */

const db = require('../config/db');

const HealthController = {
  async getHealth(req, res) {
    const dbStatus = await db.testConnection();

    res.status(200).json({
      status: 'UP',
      application: 'KKK Wheel Care Integrated Backend API',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      memoryUsage: {
        rssMb: Math.round(process.memoryUsage().rss / 1024 / 1024),
        heapUsedMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024)
      },
      database: {
        type: 'MySQL',
        connected: dbStatus.connected,
        message: dbStatus.message
      },
      microservices: {
        tyreRecommendation: 'Seneca microservice configured for Phase 4'
      }
    });
  }
};

module.exports = HealthController;
