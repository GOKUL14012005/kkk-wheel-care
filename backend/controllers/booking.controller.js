/**
 * Booking Controller
 * Manages service appointments, booking creation, status tracking, cancellations
 * Protected with customer ownership and Admin RBAC
 */

const BookingService = require('../services/booking.service');

const BookingController = {
  async getAll(req, res, next) {
    try {
      let { customerId, status, date } = req.query;

      // Enforce: regular customers can only list their own bookings
      if (req.user && req.user.role !== 'ADMIN') {
        customerId = req.user.id;
      }

      const bookings = await BookingService.getAllBookings({ customerId, status, date });
      res.status(200).json({
        success: true,
        count: bookings.length,
        data: bookings
      });
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const booking = await BookingService.getBookingById(req.params.id);
      if (!booking) {
        return res.status(404).json({
          success: false,
          error: `Booking with ID ${req.params.id} not found.`
        });
      }

      // Enforce: customers can only access their own booking
      if (req.user && req.user.role !== 'ADMIN' && booking.customer_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          error: 'Forbidden: You can only view your own booking details.'
        });
      }

      res.status(200).json({
        success: true,
        data: booking
      });
    } catch (err) {
      next(err);
    }
  },

  async getByReference(req, res, next) {
    try {
      const booking = await BookingService.getBookingByReference(req.params.ref);
      if (!booking) {
        return res.status(404).json({
          success: false,
          error: `Booking with reference ${req.params.ref} not found.`
        });
      }

      // If user is logged in and not admin, verify ownership
      if (req.user && req.user.role !== 'ADMIN' && booking.customer_id && booking.customer_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          error: 'Forbidden: You can only view your own booking details.'
        });
      }

      res.status(200).json({
        success: true,
        data: booking
      });
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const payload = { ...req.body };

      // If authenticated customer, bind booking to their verified customer ID
      if (req.user && req.user.role !== 'ADMIN') {
        payload.customerId = req.user.id;
      }

      const booking = await BookingService.createBooking(payload);
      res.status(201).json({
        success: true,
        message: 'Service appointment confirmed successfully.',
        data: booking
      });
    } catch (err) {
      next(err);
    }
  },

  async updateStatus(req, res, next) {
    try {
      const { status } = req.body;
      const updated = await BookingService.updateBookingStatus(req.params.id, status);
      res.status(200).json({
        success: true,
        message: `Booking status updated to ${status}.`,
        data: updated
      });
    } catch (err) {
      next(err);
    }
  },

  async cancel(req, res, next) {
    try {
      const existing = await BookingService.getBookingById(req.params.id);
      if (!existing) {
        return res.status(404).json({
          success: false,
          error: `Booking with ID ${req.params.id} not found.`
        });
      }

      // Enforce: only owner or ADMIN can cancel
      if (req.user && req.user.role !== 'ADMIN' && existing.customer_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          error: 'Forbidden: You can only cancel your own booking.'
        });
      }

      const cancelled = await BookingService.cancelBooking(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Booking cancelled successfully.',
        data: cancelled
      });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = BookingController;
