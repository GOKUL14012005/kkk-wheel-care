const express = require('express');
const router = express.Router();
const CustomerController = require('../controllers/customer.controller');
const { authenticateToken, requireAdmin } = require('../middleware/auth.middleware');

// Public customer onboarding & authentication
router.post('/register', CustomerController.register);
router.post('/login', CustomerController.login);

// Protected routes: Listing all customers is strictly reserved for ADMIN
router.get('/', authenticateToken, requireAdmin, CustomerController.getAll);

// Protected routes: Viewing/updating profile requires valid JWT (owner or admin)
router.get('/:id', authenticateToken, CustomerController.getProfile);
router.put('/:id', authenticateToken, CustomerController.updateProfile);

module.exports = router;
