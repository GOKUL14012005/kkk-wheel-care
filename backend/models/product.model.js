/**
 * Product & Inventory Data Access Model (DAL)
 * Parameterized MySQL Queries
 */

const db = require('../config/db');

const ProductModel = {
  /**
   * Fetch all active products, with optional filtering
   */
  async findAll({ category, search, minPrice, maxPrice } = {}) {
    let sql = 'SELECT * FROM products WHERE is_active = TRUE';
    const params = [];

    if (category && category !== 'all') {
      sql += ' AND category = ?';
      params.push(category);
    }

    if (search) {
      sql += ' AND (name LIKE ? OR brand LIKE ? OR description LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    if (minPrice !== undefined && minPrice !== null) {
      sql += ' AND price >= ?';
      params.push(Number(minPrice));
    }

    if (maxPrice !== undefined && maxPrice !== null) {
      sql += ' AND price <= ?';
      params.push(Number(maxPrice));
    }

    sql += ' ORDER BY id ASC';
    return await db.query(sql, params);
  },

  /**
   * Fetch a single product by ID
   */
  async findById(id) {
    const sql = 'SELECT * FROM products WHERE id = ?';
    const rows = await db.query(sql, [id]);
    return rows[0] || null;
  },

  /**
   * Fetch product by SKU
   */
  async findBySku(sku) {
    const sql = 'SELECT * FROM products WHERE sku = ?';
    const rows = await db.query(sql, [sku]);
    return rows[0] || null;
  },

  /**
   * Create a new product (Admin CRUD)
   */
  async create({ sku, name, category, brand, description, price, stockQuantity, vehicleType, terrain, specifications, imageUrl }) {
    const sql = `
      INSERT INTO products (sku, name, category, brand, description, price, stock_quantity, vehicle_type, terrain, specifications, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      sku,
      name,
      category,
      brand,
      description || '',
      price,
      stockQuantity || 0,
      vehicleType || 'all',
      terrain || 'all',
      specifications ? JSON.stringify(specifications) : null,
      imageUrl || null
    ];
    const result = await db.query(sql, params);
    return { id: result.insertId, sku, name, price };
  },

  /**
   * Update an existing product
   */
  async update(id, { name, category, brand, description, price, stockQuantity, vehicleType, terrain, specifications, imageUrl, isActive }) {
    const sql = `
      UPDATE products
      SET name = COALESCE(?, name),
          category = COALESCE(?, category),
          brand = COALESCE(?, brand),
          description = COALESCE(?, description),
          price = COALESCE(?, price),
          stock_quantity = COALESCE(?, stock_quantity),
          vehicle_type = COALESCE(?, vehicle_type),
          terrain = COALESCE(?, terrain),
          specifications = COALESCE(?, specifications),
          image_url = COALESCE(?, image_url),
          is_active = COALESCE(?, is_active)
      WHERE id = ?
    `;
    const params = [
      name || null,
      category || null,
      brand || null,
      description !== undefined ? description : null,
      price !== undefined ? price : null,
      stockQuantity !== undefined ? stockQuantity : null,
      vehicleType || null,
      terrain || null,
      specifications ? JSON.stringify(specifications) : null,
      imageUrl || null,
      isActive !== undefined ? isActive : null,
      id
    ];
    await db.query(sql, params);
    return this.findById(id);
  },

  /**
   * Soft delete a product
   */
  async delete(id) {
    const sql = 'UPDATE products SET is_active = FALSE WHERE id = ?';
    const result = await db.query(sql, [id]);
    return result.affectedRows > 0;
  }
};

module.exports = ProductModel;
