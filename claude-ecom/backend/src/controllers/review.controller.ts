import { Request, Response } from 'express';
import { Review } from '../models/Review';
import { Order } from '../models/Order';
import { calculatePagination } from '../utils/helpers';

export const createReview = async (req: Request, res: Response) => {
  try {
    const { product, rating, comment, images } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User must be logged in to review',
      });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ product, user: userId });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product',
      });
    }

    // Check if user purchased this product
    const order = await Order.findOne({
      user: userId,
      'items.product': product,
      status: 'delivered',
    });

    const review = await Review.create({
      product,
      user: userId,
      rating,
      comment,
      images,
      isVerifiedPurchase: !!order,
    });

    await review.populate('user', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: review,
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create review',
    });
  }
};

export const getProductReviews = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { page = '1', limit = '10', sortBy = 'newest' } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    let sort: any = { createdAt: -1 };
    if (sortBy === 'helpful') {
      sort = { helpful: -1 };
    } else if (sortBy === 'rating_high') {
      sort = { rating: -1 };
    } else if (sortBy === 'rating_low') {
      sort = { rating: 1 };
    }

    const [reviews, total] = await Promise.all([
      Review.find({ product: productId })
        .populate('user', 'name avatar')
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Review.countDocuments({ product: productId }),
    ]);

    const pagination = calculatePagination(pageNum, limitNum, total);

    res.status(200).json({
      success: true,
      data: reviews,
      pagination,
    });
  } catch (error) {
    console.error('Get product reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
    });
  }
};

export const updateReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rating, comment, images } = req.body;
    const userId = req.user?._id;

    const review = await Review.findOne({ _id: id, user: userId });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    if (rating !== undefined) review.rating = rating;
    if (comment !== undefined) review.comment = comment;
    if (images !== undefined) review.images = images;

    await review.save();

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      data: review,
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update review',
    });
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    const review = await Review.findOneAndDelete({ _id: id, user: userId });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete review',
    });
  }
};
