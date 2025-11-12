import { Request, Response } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const addOrderItems = async (req: Request, res: Response) => {
  const { items, shippingAddress } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  try {
    // Get full product details from DB to ensure price is correct
    const itemIds = items.map((item: any) => item.productId);
    const products = await Product.find({ '_id': { $in: itemIds } });

    const orderItems = items.map((item: any) => {
      const product = products.find(p => p._id!.toString() === item.productId);
      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }
      return {
        name: product.name,
        quantity: item.quantity,
        image: product.images[0],
        price: product.discountedPrice || product.price,
        product: product._id,
      };
    });

    const totalAmount = orderItems.reduce((acc: number, item: { price: number; quantity: number }) => acc + item.price * item.quantity, 0);

    const order = new Order({
      user: req.user!._id,
      items: orderItems,
      shippingAddress,
      totalAmount,
      payment: { // Mock payment details
          method: 'mock_card',
          status: 'completed',
          transactionId: `txn_${Date.now()}`
      }
    });

    // Reduce stock
    for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);

  } catch (error: any) {
    console.error(error);
    res.status(400).json({ message: 'Error creating order', error: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order && (order.user._id.equals(req.user!._id) || req.user!.role === 'admin')) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({ user: req.user!._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
