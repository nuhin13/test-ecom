import { Request, Response } from 'express';
import { Cart } from '../models/Cart';
import { Product } from '../models/Product';
import mongoose from 'mongoose';

export const getCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const sessionId = req.sessionID;

    const query = userId ? { user: userId } : { sessionId };
    const cart = await Cart.findOne(query).populate('items.product');

    if (!cart) {
      return res.status(200).json({
        success: true,
        data: { items: [] },
      });
    }

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cart',
    });
  }
};

export const addToCart = async (req: Request, res: Response) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user?._id;
    const sessionId = req.sessionID;

    // Verify product exists and has stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock',
      });
    }

    // Find or create cart
    const query = userId ? { user: userId } : { sessionId };
    let cart = await Cart.findOne(query);

    if (!cart) {
      cart = new Cart({
        ...(userId ? { user: userId } : { sessionId }),
        items: [],
      });
    }

    // Check if product already in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({
        product: new mongoose.Types.ObjectId(productId),
        quantity,
        addedAt: new Date(),
      });
    }

    await cart.save();
    await cart.populate('items.product');

    res.status(200).json({
      success: true,
      message: 'Product added to cart',
      data: cart,
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add to cart',
    });
  }
};

export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user?._id;
    const sessionId = req.sessionID;

    const query = userId ? { user: userId } : { sessionId };
    const cart = await Cart.findOne(query);

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Product not in cart',
      });
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    await cart.populate('items.product');

    res.status(200).json({
      success: true,
      message: 'Cart updated',
      data: cart,
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update cart',
    });
  }
};

export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const userId = req.user?._id;
    const sessionId = req.sessionID;

    const query = userId ? { user: userId } : { sessionId };
    const cart = await Cart.findOne(query);

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    cart.items = cart.items.filter((item) => item.product.toString() !== productId);

    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Product removed from cart',
      data: cart,
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove from cart',
    });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const sessionId = req.sessionID;

    const query = userId ? { user: userId } : { sessionId };
    await Cart.findOneAndDelete(query);

    res.status(200).json({
      success: true,
      message: 'Cart cleared',
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear cart',
    });
  }
};

// Merge guest cart to user cart after login
export const mergeCart = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    const [guestCart, userCart] = await Promise.all([
      Cart.findOne({ sessionId }),
      Cart.findOne({ user: userId }),
    ]);

    if (!guestCart) {
      return res.status(200).json({
        success: true,
        message: 'No guest cart to merge',
      });
    }

    if (!userCart) {
      // Convert guest cart to user cart
      guestCart.user = new mongoose.Types.ObjectId(userId.toString());
      guestCart.sessionId = undefined;
      await guestCart.save();
      await guestCart.populate('items.product');

      return res.status(200).json({
        success: true,
        message: 'Cart merged',
        data: guestCart,
      });
    }

    // Merge items
    guestCart.items.forEach((guestItem) => {
      const existingIndex = userCart.items.findIndex(
        (item) => item.product.toString() === guestItem.product.toString()
      );

      if (existingIndex > -1) {
        userCart.items[existingIndex].quantity += guestItem.quantity;
      } else {
        userCart.items.push(guestItem);
      }
    });

    await Promise.all([userCart.save(), Cart.findByIdAndDelete(guestCart._id)]);

    await userCart.populate('items.product');

    res.status(200).json({
      success: true,
      message: 'Cart merged',
      data: userCart,
    });
  } catch (error) {
    console.error('Merge cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to merge cart',
    });
  }
};
