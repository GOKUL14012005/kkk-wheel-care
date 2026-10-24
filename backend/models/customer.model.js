/**
 * Customer Profile Data Access Model (DAL)
 * Parameterized MySQL Queries
 */

const db = require('../config/db');

const CustomerModel = {
  /**
   * Find customer by email
   */
  async findByEmail(email) {
    const sql = 'SELECT * FROM customers WHERE email = ?';
    const rows = await db.query(sql, [email]);
    return rows[0] || null;
  },

  /**
   * Find customer by ID
   */
  async findById(id) {
    const sql = 'SELECT id, full_name, email, phone, vehicle_number, vehicle_type, city, pincode, role, created_at FROM customers WHERE id = ?';
    const rows = await db.query(sql, [id]);
    return rows[0] || null;
  },

  /**
   * List all customers (Admin)
   */
  async findAll() {
    const sql = 'SELECT id, full_name, email, phone, vehicle_number, vehicle_type, city, pincode, role, created_at FROM customers ORDER BY id DESC';
    return await db.query(sql);
  },

  /**
   * Create a new customer with hashed password
   */
  async create({ fullName, email, phone, vehicleNumber, vehicleType, passwordHash, city, pincode, role }) {
    const sql = `
      INSERT INTO customers (full_name, email, phone, vehicle_number, vehicle_type, password_hash, city, pincode, role)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      fullName,
      email,
      phone,
      vehicleNumber,
      vehicleType || 'Sedan',
      passwordHash,
      city || 'Chennai',
      pincode || '600001',
      role || 'CUSTOMER'
    ];
    const result = await db.query(sql, params);
    return this.findById(result.insertId);
  },

  /**
   * Update customer profile
   */
  async update(id, { fullName, phone, vehicleNumber, vehicleType, city, pincode }) {
    const sql = `
      UPDATE customers
      SET full_name = COALESCE(?, full_name),
          phone = COALESCE(?, phone),
          vehicle_number = COALESCE(?, vehicle_number),
          vehicle_type = COALESCE(?, vehicle_type),
          city = COALESCE(?, city),
          pincode = COALESCE(?, pincode)
      WHERE id = ?
    `;
    const params = [
      fullName || null,
      phone || null,
      vehicleNumber || null,
      vehicleType || null,
      city || null,
      pincode || null,
      id
    ];
    await db.query(sql, params);
    return this.findById(id);
  }
};

module.exports = CustomerModel;
