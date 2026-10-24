/**
 * KKK Wheel Care - Express HTTP Server Entry Point
 * Satisfies Requirement 5: A Node.js HTTP server
 * Satisfies Requirement 6: Three-tier architecture using Node.js and MySQL
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const apiRoutes = require('./routes');
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

// Strict CORS Configuration: No wildcard in production
const allowedOrigins = [
  'http://localhost:4200',
  'http://127.0.0.1:4200',
  'http://localhost:5000',
  'http://127.0.0.1:5000'
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL.replace(/\/$/, ''));
}

const corsOptions = {
  origin: function (origin, callback) {
    // Allow non-browser requests (e.g. mobile apps, curl, server-to-server health checks)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1 || (!isProduction && origin.startsWith('http://localhost:'))) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy violation: Origin '${origin}' is not allowed.`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// Serve API Routes
app.use('/api', apiRoutes);

// Serve static frontend from classic-web (Integrated Single Application)
const classicWebPath = path.resolve(__dirname, '../classic-web');
app.use(express.static(classicWebPath));

// Fallback for root to classic-web index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(classicWebPath, 'index.html'));
});

// 404 Handler for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `API endpoint '${req.originalUrl}' not found.`
  });
});

// Central Global Error Handler (Standardized JSON responses)
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err.message);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error',
    statusCode,
    timestamp: new Date().toISOString()
  });
});

// Start HTTP Server
const server = app.listen(PORT, async () => {
  console.log('====================================================');
  console.log(`  KKK Wheel Care Node.js HTTP Server is LIVE`);
  console.log(`  Port: http://localhost:${PORT}`);
  console.log(`  Health Check: http://localhost:${PORT}/api/health`);
  console.log(`  API Base: http://localhost:${PORT}/api/`);
  console.log('====================================================');

  // Verify DB connection state
  const dbStatus = await db.testConnection();
  console.log(`[DATABASE STATUS] ${dbStatus.message}`);
});

module.exports = { app, server };
