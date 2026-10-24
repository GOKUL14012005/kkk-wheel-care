/**
 * Service Booking Data Access Model (DAL)
 * Parameterized MySQL Queries
 */

const db = require('../config/db');

const BookingModel = {
  /**
   * Find all bookings with optional status or customer filter
   */
  async findAll({ customerId, status, date } = {}) {
    let sql = 'SELECT * FROM bookings WHERE 1=1';
    const params = [];

    if (customerId) {
      sql += ' AND customer_id = ?';
      params.push(customerId);
    }

    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }

    if (date) {
      sql += ' AND booking_date = ?';
      params.push(date);
    }

    sql += ' ORDER BY booking_date DESC, id DESC';
    return await db.query(sql, params);
  },

  /**
   * Find booking by ID
   */
  async findById(id) {
    const sql = 'SELECT * FROM bookings WHERE id = ?';
    const rows = await db.query(sql, [id]);
    return rows[0] || null;
  },

  /**
   * Find booking by unique reference code
   */
  async findByReference(reference) {
    const sql = 'SELECT * FROM bookings WHERE booking_reference = ?';
    const rows = await db.query(sql, [reference]);
    return rows[0] || null;
  },

  /**
   * Create a new service booking
   */
  async create({ bookingReference, customerId, customerName, customerEmail, customerPhone, vehicleNumber, serviceName, servicePrice, bookingDate, timeSlot, notes, status }) {
    const sql = `
      INSERT INTO bookings (booking_reference, customer_id, customer_name, customer_email, customer_phone, vehicle_number, service_name, service_price, booking_date, time_slot, notes, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      bookingReference,
      customerId || null,
      customerName,
      customerEmail,
      customerPhone,
      vehicleNumber,
      serviceName,
      servicePrice,
      bookingDate,
      timeSlot,
      notes || null,
      status || 'CONFIRMED'
    ];
    const result = await db.query(sql, params);
    return this.findById(result.insertId);
  },

  /**
   * Update booking status (e.g. CONFIRMED, COMPLETED, CANCELLED)
   */
  async updateStatus(id, status) {
    const sql = 'UPDATE bookings SET status = ? WHERE id = ?';
    await db.query(sql, [status, id]);
    return this.findById(id);
  },

  /**
   * Delete / Cancel booking
   */
  async delete(id) {
    const sql = 'DELETE FROM bookings WHERE id = ?';
    const result = await db.query(sql, [id]);
    return result.affectedRows > 0;
  }
};

module.exports = BookingModel;
