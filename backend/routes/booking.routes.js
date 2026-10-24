const express = require('express');
const router = express.Router();
const BookingController = require('../controllers/booking.controller');
const { authenticateToken, optionalAuth, requireAdmin } = require('../middleware/auth.middleware');

// Service Booking CRUD Routes

// Listing bookings requires valid JWT authentication (customers see only theirs; admin sees all)
router.get('/', authenticateToken, BookingController.getAll);

// Accessing specific booking requires authentication and ownership or admin role
router.get('/:id', authenticateToken, BookingController.getById);
router.get('/ref/:ref', optionalAuth, BookingController.getByReference);

// Creating booking supports both guest and authenticated customer appointments
router.post('/', optionalAuth, BookingController.create);

// Status updates are strictly restricted to workshop administrators
router.patch('/:id/status', authenticateToken, requireAdmin, BookingController.updateStatus);

// Cancellation requires authentication (owner or admin)
router.delete('/:id', authenticateToken, BookingController.cancel);

module.exports = router;
