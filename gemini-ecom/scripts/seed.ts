/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';

// Load environment variables from the backend .env file
dotenv.config({ path: '../backend/.env' });

// Import models (adjust path as necessary)
import User from '../backend/src/models/User';
import Product from '../backend/src/models/Product';
import Category from '../backend/src/models/Category';
import Review from '../backend/src/models/Review';
import Order from '../backend/src/models/Order';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/bd-sourcing';
    console.log(`Connecting to: ${mongoUri}`);

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    await mongoose.connect(mongoUri);

    // Verify connection is ready
    if (mongoose.connection.readyState === 1) {
      console.log('MongoDB Connected for Seeding...');
      // Wait for models to initialize
      await new Promise(resolve => setTimeout(resolve, 1000));
    } else {
      throw new Error('MongoDB connection not ready');
    }

  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};


const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Category.deleteMany();
    await Review.deleteMany();
    console.log('Data Destroyed!');
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    // 1. Create Categories
    const categoriesData = [
      { name: 'Jute & Handicrafts', slug: 'jute-handicrafts', image: faker.image.urlLoremFlickr({ category: 'crafts' }) },
      { name: 'Leather Goods', slug: 'leather-goods', image: faker.image.urlLoremFlickr({ category: 'fashion' }) },
      { name: 'Apparel & Textiles', slug: 'apparel-textiles', image: faker.image.urlLoremFlickr({ category: 'nature' }) },
      { name: 'Ceramics', slug: 'ceramics', image: faker.image.urlLoremFlickr({ category: 'art' }) },
      { name: 'Home Decor', slug: 'home-decor', image: faker.image.urlLoremFlickr({ category: 'house' }) },
      { name: 'Agro-processed', slug: 'agro-processed', image: faker.image.urlLoremFlickr({ category: 'food' }) },
    ];
    const createdCategories = await Category.insertMany(categoriesData);
    console.log('Categories Imported!');

    // 2. Create Users
    const usersData = Array.from({ length: 10 }, () => {
      const salt = bcrypt.genSaltSync(10);
      return {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: bcrypt.hashSync('123456', salt),
        role: 'user',
      };
    });
    const createdUsers = await User.insertMany(usersData);
    console.log('Users Imported!');
    
    // Create one admin user
    const salt = bcrypt.genSaltSync(10);
    const adminUser = await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: bcrypt.hashSync('123456', salt),
        role: 'admin',
    });
    console.log(`Admin User Imported! ID: ${adminUser._id}. Use this for ADMIN_USER_ID in backend/.env`);


    // 3. Create Products
    const productsData = Array.from({ length: 30 }, () => {
      const category = faker.helpers.arrayElement(createdCategories);
      const price = parseFloat(faker.commerce.price({ min: 10, max: 500 }));
      return {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: price,
        discountedPrice: faker.datatype.boolean(0.3) ? parseFloat((price * 0.8).toFixed(2)) : undefined,
        category: category._id,
        stock: faker.number.int({ min: 0, max: 100 }),
        images: Array.from({ length: faker.number.int({ min: 2, max: 4 }) }, () => faker.image.urlLoremFlickr({ category: 'technics' })),
        video: 'https://www.w3schools.com/html/mov_bbb.mp4', // Sample video
        specs: {
          Material: faker.commerce.productMaterial(),
          Origin: 'Bangladesh',
          Size: `${faker.number.int({ min: 1, max: 100 })}cm`,
        },
        deliveryEstimateDays: faker.number.int({ min: 2, max: 10 }),
        isAvailable: faker.datatype.boolean(0.9),
      };
    });
    const createdProducts = await Product.insertMany(productsData);
    console.log('Products Imported!');

    // 4. Create Reviews
    const reviewsData = Array.from({ length: 100 }, () => ({
      user: faker.helpers.arrayElement(createdUsers)._id,
      product: faker.helpers.arrayElement(createdProducts)._id,
      rating: faker.number.int({ min: 3, max: 5 }),
      comment: faker.lorem.sentence(),
    }));
    await Review.insertMany(reviewsData);
    console.log('Reviews Imported!');

    // 5. Update Product Ratings based on reviews
    for (const product of createdProducts) {
        const reviews = await Review.find({ product: product._id });
        if (reviews.length > 0) {
            const avg = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
            product.ratings.count = reviews.length;
            product.ratings.average = parseFloat(avg.toFixed(2));
            await product.save();
        }
    }
    console.log('Product ratings updated!');


    console.log('Data Imported Successfully!');
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const run = async () => {
  await connectDB();

  if (process.argv[2] === '-d') {
    console.log('-d');
    await destroyData();
  } else {
    console.log('no ');

    //await destroyData(); // Clear before seeding

    console.log('no 2');
    await importData();
  }
  process.exit();
};

run();
