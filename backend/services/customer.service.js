/**
 * Customer Business Logic Service
 * Secure registration, bcrypt password hashing, login verification, profile management
 */

const bcrypt = require('bcryptjs');
const CustomerModel = require('../models/customer.model');

const CustomerService = {
  async register({ fullName, email, phone, vehicleNumber, vehicleType, password, city, pincode }) {
    if (!fullName || !email || !phone || !vehicleNumber || !password) {
      const err = new Error('Full name, email, phone, vehicle number, and password are required.');
      err.statusCode = 400;
      throw err;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      const err = new Error('Invalid email address format.');
      err.statusCode = 400;
      throw err;
    }

    if (password.length < 6) {
      const err = new Error('Password must be at least 6 characters long.');
      err.statusCode = 400;
      throw err;
    }

    // Check duplicate email
    const existing = await CustomerModel.findByEmail(email.trim());
    if (existing) {
      const err = new Error('A customer with this email address already exists.');
      err.statusCode = 409;
      throw err;
    }

    // Hash password with bcrypt (salt 10)
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newCustomer = await CustomerModel.create({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      vehicleNumber: vehicleNumber.trim().toUpperCase(),
      vehicleType: vehicleType || 'Sedan',
      passwordHash,
      city: city || 'Chennai',
      pincode: pincode || '600001',
      role: 'CUSTOMER'
    });

    return newCustomer;
  },

  async login(email, password) {
    if (!email || !password) {
      const err = new Error('Email and password must be provided.');
      err.statusCode = 400;
      throw err;
    }

    const customer = await CustomerModel.findByEmail(email.trim().toLowerCase());
    if (!customer) {
      const err = new Error('Invalid email address or password.');
      err.statusCode = 401;
      throw err;
    }

    const isMatch = await bcrypt.compare(password, customer.password_hash);
    if (!isMatch) {
      const err = new Error('Invalid email address or password.');
      err.statusCode = 401;
      throw err;
    }

    // Return sanitized profile (never include password_hash)
    return {
      id: customer.id,
      fullName: customer.full_name,
      email: customer.email,
      phone: customer.phone,
      vehicleNumber: customer.vehicle_number,
      vehicleType: customer.vehicle_type,
      city: customer.city,
      pincode: customer.pincode,
      role: customer.role
    };
  },

  async getProfile(id) {
    const profile = await CustomerModel.findById(id);
    if (!profile) {
      const err = new Error(`Customer with ID ${id} not found.`);
      err.statusCode = 404;
      throw err;
    }
    return profile;
  },

  async updateProfile(id, data) {
    await this.getProfile(id);
    return await CustomerModel.update(id, data);
  },

  async getAllCustomers() {
    return await CustomerModel.findAll();
  }
};

module.exports = CustomerService;
