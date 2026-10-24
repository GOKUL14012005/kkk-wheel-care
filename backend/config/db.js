/**
 * Database Connection Pool Configuration
 * Uses mysql2/promise for connection pooling and parameterized query execution.
 */

const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

let pool = null;
let isDbConnected = false;
let dbErrorDetails = null;

// Optional TLS configuration for hosted cloud MySQL providers
let sslConfig = undefined;
if (process.env.DB_SSL === 'true') {
  sslConfig = {
    // Validate server certificate by default; do not silently disable validation
    rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false'
  };

  if (process.env.DB_SSL_CA) {
    sslConfig.ca = process.env.DB_SSL_CA;
  } else if (process.env.DB_SSL_CA_PATH) {
    try {
      const fs = require('fs');
      sslConfig.ca = fs.readFileSync(path.resolve(process.env.DB_SSL_CA_PATH), 'utf8');
    } catch (caErr) {
      console.error('[DB SSL CONFIG] Could not read CA certificate from DB_SSL_CA_PATH:', caErr.message);
    }
  }
}

try {
  const poolConfig = {
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'kkk_wheel_care',
    waitForConnections: true,
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT, 10) || 10,
    queueLimit: 0,
    decimalNumbers: true
  };

  if (sslConfig) {
    poolConfig.ssl = sslConfig;
  }

  pool = mysql.createPool(poolConfig);
} catch (err) {
  console.error('[DB CONFIG ERROR] Failed to instantiate MySQL connection pool:', err.message);
  dbErrorDetails = err.message;
}

/**
 * Tests database connectivity
 * @returns {Promise<{connected: boolean, message: string}>}
 */
async function testConnection() {
  if (!pool) {
    return {
      connected: false,
      message: 'Connection pool not instantiated. Check backend/.env configuration.'
    };
  }

  try {
    const connection = await pool.getConnection();
    await connection.query('SELECT 1 AS health_check');
    connection.release();
    isDbConnected = true;
    dbErrorDetails = null;
    return {
      connected: true,
      message: `Successfully connected to MySQL database: ${process.env.DB_NAME || 'kkk_wheel_care'}`
    };
  } catch (error) {
    isDbConnected = false;
    dbErrorDetails = error.message;
    return {
      connected: false,
      message: `MySQL connection failed: ${error.message}. Please verify database credentials in environment configuration.`
    };
  }
}

/**
 * Executes a parameterized SQL query safely
 * @param {string} sql - Parameterized SQL string
 * @param {Array} params - Array of parameter values
 * @returns {Promise<any>}
 */
async function query(sql, params = []) {
  if (!pool) {
    throw new Error('Database pool not available. Please verify backend/.env settings.');
  }
  const [results] = await pool.execute(sql, params);
  return results;
}

module.exports = {
  pool,
  query,
  testConnection,
  getStatus: () => ({
    connected: isDbConnected,
    error: dbErrorDetails,
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    database: process.env.DB_NAME || 'kkk_wheel_care',
    user: process.env.DB_USER || 'root'
  })
};
