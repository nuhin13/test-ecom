import { Request, Response } from 'express';
import { Product } from '../models/Product';
import { config } from '../config/env';
import { calculatePagination } from '../utils/helpers';
import mongoSanitize from 'express-mongo-sanitize';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const {
      page = '1',
      limit = config.defaultPageSize.toString(),
      search = '',
      category,
      minPrice,
      maxPrice,
      minRating,
      available,
      sortBy = 'newest',
    } = req.query;

    // Sanitize inputs
    const searchString = typeof search === 'string' ? search : '';
    const sanitizedSearch = searchString ? mongoSanitize.sanitize({ search: searchString }).search : '';

    // Build query
    const query: any = {};

    if (sanitizedSearch) {
      query.$text = { $search: sanitizedSearch };
    }

    if (category) {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice as string);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice as string);
    }

    if (minRating) {
      query['rating.average'] = { $gte: parseFloat(minRating as string) };
    }

    if (available !== undefined) {
      query.isAvailable = available === 'true';
    }

    // Build sort
    let sort: any = {};
    switch (sortBy) {
      case 'price_asc':
        sort = { price: 1 };
        break;
      case 'price_desc':
        sort = { price: -1 };
        break;
      case 'rating':
        sort = { 'rating.average': -1 };
        break;
      case 'newest':
      default:
        sort = { createdAt: -1 };
        break;
    }

    // Pagination
    const pageNum = parseInt(page as string, 10);
    const limitNum = Math.min(parseInt(limit as string, 10), config.maxPageSize);
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const [products, total] = await Promise.all([
      Product.find(query).sort(sort).skip(skip).limit(limitNum).lean(),
      Product.countDocuments(query),
    ]);

    const pagination = calculatePagination(pageNum, limitNum, total);

    res.status(200).json({
      success: true,
      data: products,
      pagination,
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
    });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Get product by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
    });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Product.distinct('category');

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
    });
  }
};

export const getTopRatedProducts = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;

    const products = await Product.find({ 'rating.count': { $gt: 0 } })
      .sort({ 'rating.average': -1 })
      .limit(limit)
      .lean();

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error('Get top rated products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch top rated products',
    });
  }
};

export const getProductsByCategory = async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const limit = parseInt(req.query.limit as string) || 10;

    const products = await Product.find({ category })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
    });
  }
};
