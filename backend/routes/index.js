const express = require('express');
const router = express.Router();

const healthRoutes = require('./health.routes');
const productRoutes = require('./product.routes');
const customerRoutes = require('./customer.routes');
const bookingRoutes = require('./booking.routes');
const recommendationRoutes = require('./recommendation.routes');

// Mount sub-routers
router.use('/health', healthRoutes);
router.use('/products', productRoutes);
router.use('/customers', customerRoutes);
router.use('/bookings', bookingRoutes);
router.use('/recommendations', recommendationRoutes);

module.exports = router;
