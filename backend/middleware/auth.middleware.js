/**
 * Authentication & Authorization Middleware
 * Verifies cryptographically signed JSON Web Tokens (JWT) using jsonwebtoken
 * Enforces Role-Based Access Control (RBAC)
 */

const jwt = require('jsonwebtoken');

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET environment variable is mandatory in production.');
    }
    return 'dev_insecure_jwt_secret_fallback_key_2026';
  }
  return secret;
}

/**
 * Middleware: Enforces valid JWT on protected routes
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      error: 'Authentication token is required.'
    });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      success: false,
      error: 'Malformed authorization header. Expected Bearer <token>.'
    });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, getJwtSecret());
    req.user = decoded; // { id, email, role, iat, exp }
    next();
  } catch (err) {
    const isExpired = err.name === 'TokenExpiredError';
    return res.status(401).json({
      success: false,
      error: isExpired ? 'Authentication token has expired. Please log in again.' : 'Invalid or unverified authentication token.'
    });
  }
}

/**
 * Middleware: Optional token extraction
 * If Bearer token is provided, decodes and attaches user; otherwise proceeds
 */
function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return next();
  }

  const parts = authHeader.split(' ');
  if (parts.length === 2 && parts[0] === 'Bearer') {
    try {
      const decoded = jwt.verify(parts[1], getJwtSecret());
      req.user = decoded;
    } catch (err) {
      // Ignored for optional paths
    }
  }
  next();
}

/**
 * Middleware: Enforces Admin role
 */
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      error: 'Forbidden: Administrator privileges required.'
    });
  }
  next();
}

module.exports = {
  getJwtSecret,
  authenticateToken,
  optionalAuth,
  requireAdmin
};
