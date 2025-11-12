import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { admin } from '../middleware/adminMiddleware';
import { validate } from '../middleware/validationMiddleware';
import { productCreateSchema, categoryCreateSchema } from '../utils/validators';
import Product from '../models/Product';
import Category from '../models/Category';
import User from '../models/User';
import Order from '../models/Order';

const router = express.Router();

// All routes in this file are protected and for admins only
router.use(protect, admin);

// @desc    Create a product
// @route   POST /api/admin/products
router.post('/products', validate(productCreateSchema), async (req, res) => {
    const product = new Product(req.body);
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/admin/products/:id
router.put('/products/:id', async (req, res) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

// @desc    Delete a product
// @route   DELETE /api/admin/products/:id
router.delete('/products/:id', async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (product) {
        res.json({ message: 'Product removed' });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

// @desc    Create a category
// @route   POST /api/admin/categories
router.post('/categories', validate(categoryCreateSchema), async (req, res) => {
    const category = new Category(req.body);
    const createdCategory = await category.save();
    res.status(201).json(createdCategory);
});

// @desc    Get all users
// @route   GET /api/admin/users
router.get('/users', async (req, res) => {
    const users = await User.find({});
    res.json(users);
});

// @desc    Get all orders
// @route   GET /api/admin/orders
router.get('/orders', async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
});


export default router;
