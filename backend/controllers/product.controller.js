/**
 * Product Controller
 * Handles HTTP requests, responds with standard JSON and appropriate status codes
 */

const ProductService = require('../services/product.service');

const ProductController = {
  async getAll(req, res, next) {
    try {
      const { category, search, minPrice, maxPrice } = req.query;
      const products = await ProductService.getAllProducts({ category, search, minPrice, maxPrice });
      res.status(200).json({
        success: true,
        count: products.length,
        data: products
      });
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const product = await ProductService.getProductById(req.params.id);
      res.status(200).json({
        success: true,
        data: product
      });
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const product = await ProductService.createProduct(req.body);
      res.status(201).json({
        success: true,
        message: 'Product created successfully in inventory.',
        data: product
      });
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const updated = await ProductService.updateProduct(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Product updated successfully.',
        data: updated
      });
    } catch (err) {
      next(err);
    }
  },

  async remove(req, res, next) {
    try {
      await ProductService.deleteProduct(req.params.id);
      res.status(200).json({
        success: true,
        message: `Product with ID ${req.params.id} has been deactivated.`
      });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = ProductController;
