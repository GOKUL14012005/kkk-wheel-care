const express = require('express');
const router = express.Router();
const HealthController = require('../controllers/health.controller');

// GET /api/health
router.get('/', HealthController.getHealth);

module.exports = router;
