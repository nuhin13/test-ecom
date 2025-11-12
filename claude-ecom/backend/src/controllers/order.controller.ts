import { Request, Response } from 'express';
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { Cart } from '../models/Cart';
import { calculateShippingCost, estimateDeliveryDate, calculatePagination } from '../utils/helpers';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { items, shippingAddress, paymentMethod = 'mock', notes } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User must be logged in to place order',
      });
    }

    // Validate and fetch products
    const productIds = items.map((item: any) => item.product);
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== items.length) {
      return res.status(400).json({
        success: false,
        message: 'Some products not found',
      });
    }

    // Check stock and calculate totals
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = products.find((p) => (p._id as any).toString() === item.product);

      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product ${item.product} not found`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`,
        });
      }

      const price = product.discountedPrice || product.price;
      totalAmount += price * item.quantity;

      orderItems.push({
        product: product._id,
        productName: product.name,
        productImage: product.images[0],
        quantity: item.quantity,
        price: product.price,
        discountedPrice: product.discountedPrice,
      });
    }

    const shippingCost = calculateShippingCost(totalAmount);
    const finalAmount = totalAmount + shippingCost;

    // Create order
    const order = await Order.create({
      user: userId,
      items: orderItems,
      totalAmount,
      shippingCost,
      finalAmount,
      paymentMethod,
      shippingAddress,
      notes,
      estimatedDelivery: estimateDeliveryDate(7),
    });

    // Update product stock
    const bulkOps = items.map((item: any) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { stock: -item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOps);

    // Clear cart
    await Cart.findOneAndDelete({ user: userId });

    // Mock payment processing
    if (paymentMethod === 'mock') {
      order.paymentStatus = 'paid';
      order.status = 'confirmed';
      order.paymentDetails = {
        transactionId: `MOCK-${Date.now()}`,
        paidAt: new Date(),
      };
      await order.save();
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
    });
  }
};

export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { page = '1', limit = '10' } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const [orders, total] = await Promise.all([
      Order.find({ user: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Order.countDocuments({ user: userId }),
    ]);

    const pagination = calculatePagination(pageNum, limitNum, total);

    res.status(200).json({
      success: true,
      data: orders,
      pagination,
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
    });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    const order = await Order.findOne({
      _id: id,
      user: userId,
    }).populate('items.product');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error('Get order by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
    });
  }
};

export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user?._id;

    const order = await Order.findOne({ _id: id, user: userId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (['shipped', 'delivered', 'cancelled'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel order with status: ${order.status}`,
      });
    }

    // Restore stock
    const bulkOps = order.items.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { stock: item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOps);

    order.status = 'cancelled';
    order.cancelledAt = new Date();
    order.cancellationReason = reason;
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: order,
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
    });
  }
};
