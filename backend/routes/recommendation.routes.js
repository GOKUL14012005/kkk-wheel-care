/**
 * Backend Recommendation Proxy Routes
 * Bridges Express REST API to the Seneca Microservice on port 5001
 * Satisfies Requirement 9: Node.js Seneca microservice integration
 */

const express = require('express');
const router = express.Router();
const http = require('http');
const https = require('https');

/**
 * Forward recommendation request to Seneca microservice
 * Dynamically resolves protocol, hostname, port, and path from process.env.SENECA_URL
 */
function invokeSenecaMicroservice(payload) {
  return new Promise((resolve, reject) => {
    let parsedUrl;
    try {
      parsedUrl = new URL(process.env.SENECA_URL || 'http://localhost:5001');
    } catch (urlErr) {
      return reject(new Error(`Invalid SENECA_URL configuration: ${urlErr.message}`));
    }

    const isHttps = parsedUrl.protocol === 'https:';
    const client = isHttps ? https : http;
    const defaultPort = isHttps ? 443 : 80;
    const postData = JSON.stringify(payload);

    const basePath = parsedUrl.pathname.replace(/\/$/, '');
    const options = {
      protocol: parsedUrl.protocol,
      hostname: parsedUrl.hostname,
      port: parsedUrl.port ? parseInt(parsedUrl.port, 10) : defaultPort,
      path: (basePath ? basePath : '') + '/act',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 5000
    };

    const req = client.request(options, (res) => {
      let rawData = '';
      res.on('data', chunk => rawData += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(rawData);
          resolve(parsed);
        } catch (e) {
          reject(new Error(`Failed to parse Seneca response: ${rawData}`));
        }
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Connection timed out contacting Seneca microservice at ${parsedUrl.origin}.`));
    });

    req.on('error', (err) => {
      reject(new Error(`Seneca microservice unreachable at ${parsedUrl.origin}: ${err.message}`));
    });

    req.write(postData);
    req.end();
  });
}

// POST /api/recommendations/tyres
router.post('/tyres', async (req, res) => {
  try {
    const { vehicleType, terrain, budget, preference } = req.body;
    const result = await invokeSenecaMicroservice({
      vehicleType,
      terrain,
      budget,
      preference
    });

    res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    // Graceful error handling for microservice connectivity failure
    console.warn('[MICROSERVICE WARNING]', err.message);
    res.status(503).json({
      success: false,
      microservice: 'Seneca Tyre Recommendation Engine',
      status: 'OFFLINE_OR_UNAVAILABLE',
      error: err.message,
      message: 'The Seneca recommendation microservice is currently unreachable. Start it with `npm start` inside microservices/tyre-recommendation.'
    });
  }
});

// GET /api/recommendations/tyres (Query param support)
router.get('/tyres', async (req, res) => {
  try {
    const { vehicleType, terrain, budget, preference } = req.query;
    const result = await invokeSenecaMicroservice({
      vehicleType,
      terrain,
      budget,
      preference
    });

    res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    res.status(503).json({
      success: false,
      microservice: 'Seneca Tyre Recommendation Engine',
      status: 'OFFLINE_OR_UNAVAILABLE',
      error: err.message
    });
  }
});

module.exports = router;
