/**
 * Product Business Logic Service
 * Validates inventory rules, price limits, SKU generation, and category constraints
 */

const ProductModel = require('../models/product.model');

const ProductService = {
  async getAllProducts(filters) {
    return await ProductModel.findAll(filters);
  },

  async getProductById(id) {
    const product = await ProductModel.findById(id);
    if (!product) {
      const err = new Error(`Product with ID ${id} not found.`);
      err.statusCode = 404;
      throw err;
    }
    return product;
  },

  async createProduct(data) {
    if (!data.name || !data.category || !data.brand || data.price === undefined) {
      const err = new Error('Product name, category, brand, and price are mandatory fields.');
      err.statusCode = 400;
      throw err;
    }

    if (Number(data.price) <= 0) {
      const err = new Error('Product price must be a positive number.');
      err.statusCode = 400;
      throw err;
    }

    // Auto-generate SKU if omitted
    if (!data.sku) {
      const prefix = data.category.substring(0, 3).toUpperCase();
      const rand = Math.floor(100 + Math.random() * 900);
      data.sku = `${prefix}-${data.brand.substring(0, 3).toUpperCase()}-${rand}`;
    }

    // Check SKU duplicate
    const existing = await ProductModel.findBySku(data.sku);
    if (existing) {
      const err = new Error(`Product with SKU '${data.sku}' already exists.`);
      err.statusCode = 409;
      throw err;
    }

    return await ProductModel.create(data);
  },

  async updateProduct(id, data) {
    await this.getProductById(id); // Throws 404 if not found
    if (data.price !== undefined && Number(data.price) <= 0) {
      const err = new Error('Product price must be greater than zero.');
      err.statusCode = 400;
      throw err;
    }
    return await ProductModel.update(id, data);
  },

  async deleteProduct(id) {
    await this.getProductById(id);
    return await ProductModel.delete(id);
  }
};

module.exports = ProductService;
