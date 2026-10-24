/**
 * Service Booking Business Logic Service
 * Generates unique booking references, checks slot rules, handles booking statuses
 */

const BookingModel = require('../models/booking.model');

const BookingService = {
  async getAllBookings(filters) {
    return await BookingModel.findAll(filters);
  },

  async getBookingById(id) {
    const booking = await BookingModel.findById(id);
    if (!booking) {
      const err = new Error(`Booking with ID ${id} not found.`);
      err.statusCode = 404;
      throw err;
    }
    return booking;
  },

  async getBookingByReference(ref) {
    const booking = await BookingModel.findByReference(ref);
    if (!booking) {
      const err = new Error(`Booking with reference '${ref}' not found.`);
      err.statusCode = 404;
      throw err;
    }
    return booking;
  },

  async createBooking(data) {
    if (!data.serviceName || !data.bookingDate || !data.timeSlot || !data.vehicleNumber || !data.customerName || !data.customerEmail) {
      const err = new Error('Service name, date, time slot, vehicle number, customer name, and customer email are required.');
      err.statusCode = 400;
      throw err;
    }

    // Generate unique academic booking reference
    const refCode = 'BK-KKK-' + Math.floor(100000 + Math.random() * 900000);
    data.bookingReference = refCode;
    data.servicePrice = Number(data.servicePrice) || 0;
    data.status = data.status || 'CONFIRMED';

    return await BookingModel.create(data);
  },

  async updateBookingStatus(id, status) {
    const allowed = ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
    if (!allowed.includes(status)) {
      const err = new Error(`Invalid status. Allowed values: ${allowed.join(', ')}`);
      err.statusCode = 400;
      throw err;
    }

    await this.getBookingById(id);
    return await BookingModel.updateStatus(id, status);
  },

  async cancelBooking(id) {
    await this.getBookingById(id);
    return await BookingModel.updateStatus(id, 'CANCELLED');
  }
};

module.exports = BookingService;
