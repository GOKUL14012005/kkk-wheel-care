/**
 * Customer Controller
 * Registration, login, profile view, profile update
 * Cryptographically signed JWT authentication
 */

const jwt = require('jsonwebtoken');
const CustomerService = require('../services/customer.service');
const { getJwtSecret } = require('../middleware/auth.middleware');

const CustomerController = {
  async register(req, res, next) {
    try {
      const customer = await CustomerService.register(req.body);
      res.status(201).json({
        success: true,
        message: 'Customer registered successfully.',
        data: customer
      });
    } catch (err) {
      next(err);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await CustomerService.login(email, password);

      // Sign cryptographic JWT token with 24-hour expiration
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role
        },
        getJwtSecret(),
        { expiresIn: '24h' }
      );

      res.status(200).json({
        success: true,
        message: 'Authentication successful.',
        data: user,
        token
      });
    } catch (err) {
      next(err);
    }
  },

  async getProfile(req, res, next) {
    try {
      const targetId = parseInt(req.params.id, 10);

      // Enforce ownership: only the authenticated user or an ADMIN can view the profile
      if (req.user && req.user.role !== 'ADMIN' && req.user.id !== targetId) {
        return res.status(403).json({
          success: false,
          error: 'Forbidden: You can only access your own customer profile.'
        });
      }

      const profile = await CustomerService.getProfile(targetId);
      res.status(200).json({
        success: true,
        data: profile
      });
    } catch (err) {
      next(err);
    }
  },

  async updateProfile(req, res, next) {
    try {
      const targetId = parseInt(req.params.id, 10);

      // Enforce ownership: only the authenticated user or an ADMIN can update the profile
      if (req.user && req.user.role !== 'ADMIN' && req.user.id !== targetId) {
        return res.status(403).json({
          success: false,
          error: 'Forbidden: You can only update your own customer profile.'
        });
      }

      const updated = await CustomerService.updateProfile(targetId, req.body);
      res.status(200).json({
        success: true,
        message: 'Customer profile updated successfully.',
        data: updated
      });
    } catch (err) {
      next(err);
    }
  },

  async getAll(req, res, next) {
    try {
      const customers = await CustomerService.getAllCustomers();
      res.status(200).json({
        success: true,
        count: customers.length,
        data: customers
      });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = CustomerController;
