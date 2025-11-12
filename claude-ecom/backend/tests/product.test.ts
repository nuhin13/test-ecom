import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';
import { Product } from '../src/models/Product';

describe('Product API', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:10000/bd-sourcing-test');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Product.deleteMany({});
  });

  describe('GET /api/products', () => {
    it('should return empty array when no products exist', async () => {
      const response = await request(app).get('/api/products').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
    });

    it('should return products with pagination', async () => {
      // Create test products
      await Product.create([
        {
          name: 'Test Product 1',
          description: 'Description 1',
          category: 'Electronics',
          price: 100,
          images: ['image1.jpg'],
          stock: 10,
          sku: 'TEST001',
        },
        {
          name: 'Test Product 2',
          description: 'Description 2',
          category: 'Clothing',
          price: 50,
          images: ['image2.jpg'],
          stock: 20,
          sku: 'TEST002',
        },
      ]);

      const response = await request(app).get('/api/products').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(2);
      expect(response.body.pagination).toBeDefined();
    });

    it('should filter products by category', async () => {
      await Product.create([
        {
          name: 'Electronics Product',
          description: 'Description',
          category: 'Electronics',
          price: 100,
          images: ['image.jpg'],
          stock: 10,
          sku: 'ELEC001',
        },
        {
          name: 'Clothing Product',
          description: 'Description',
          category: 'Clothing',
          price: 50,
          images: ['image.jpg'],
          stock: 20,
          sku: 'CLOTH001',
        },
      ]);

      const response = await request(app).get('/api/products?category=Electronics').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].category).toBe('Electronics');
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return product by ID', async () => {
      const product = await Product.create({
        name: 'Test Product',
        description: 'Description',
        category: 'Electronics',
        price: 100,
        images: ['image.jpg'],
        stock: 10,
        sku: 'TEST001',
      });

      const response = await request(app).get(`/api/products/${product._id}`).expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Test Product');
    });

    it('should return 500 for invalid product ID', async () => {
      const response = await request(app).get('/api/products/invalid-id').expect(500);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/products/categories', () => {
    it('should return list of categories', async () => {
      await Product.create([
        {
          name: 'Product 1',
          description: 'Description',
          category: 'Electronics',
          price: 100,
          images: ['image.jpg'],
          stock: 10,
          sku: 'P001',
        },
        {
          name: 'Product 2',
          description: 'Description',
          category: 'Clothing',
          price: 50,
          images: ['image.jpg'],
          stock: 20,
          sku: 'P002',
        },
      ]);

      const response = await request(app).get('/api/products/categories').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toContain('Electronics');
      expect(response.body.data).toContain('Clothing');
    });
  });
});
