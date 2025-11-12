"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unused-vars */
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const faker_1 = require("@faker-js/faker");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// Load environment variables from the backend .env file
dotenv_1.default.config({ path: '../backend/.env' });
// Import models (adjust path as necessary)
const User_1 = __importDefault(require("../backend/src/models/User"));
const Product_1 = __importDefault(require("../backend/src/models/Product"));
const Category_1 = __importDefault(require("../backend/src/models/Category"));
const Review_1 = __importDefault(require("../backend/src/models/Review"));
const Order_1 = __importDefault(require("../backend/src/models/Order"));
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/bd-sourcing';
        console.log(`Connecting to: ${mongoUri}`);
        mongoose_1.default.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });
        mongoose_1.default.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });
        await mongoose_1.default.connect(mongoUri);
        // Verify connection is ready
        if (mongoose_1.default.connection.readyState === 1) {
            console.log('MongoDB Connected for Seeding...');
            // Wait for models to initialize
            await new Promise(resolve => setTimeout(resolve, 20000));
        }
        else {
            throw new Error('MongoDB connection not ready');
        }
    }
    catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};
const destroyData = async () => {
    try {
        await Order_1.default.deleteMany();
        await Product_1.default.deleteMany();
        await User_1.default.deleteMany();
        await Category_1.default.deleteMany();
        await Review_1.default.deleteMany();
        console.log('Data Destroyed!');
    }
    catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};
const importData = async () => {
    try {
        // 1. Create Categories
        const categoriesData = [
            { name: 'Jute & Handicrafts', slug: 'jute-handicrafts', image: faker_1.faker.image.urlLoremFlickr({ category: 'crafts' }) },
            { name: 'Leather Goods', slug: 'leather-goods', image: faker_1.faker.image.urlLoremFlickr({ category: 'fashion' }) },
            { name: 'Apparel & Textiles', slug: 'apparel-textiles', image: faker_1.faker.image.urlLoremFlickr({ category: 'nature' }) },
            { name: 'Ceramics', slug: 'ceramics', image: faker_1.faker.image.urlLoremFlickr({ category: 'art' }) },
            { name: 'Home Decor', slug: 'home-decor', image: faker_1.faker.image.urlLoremFlickr({ category: 'house' }) },
            { name: 'Agro-processed', slug: 'agro-processed', image: faker_1.faker.image.urlLoremFlickr({ category: 'food' }) },
        ];
        const createdCategories = await Category_1.default.insertMany(categoriesData);
        console.log('Categories Imported!');
        // 2. Create Users
        const usersData = Array.from({ length: 10 }, () => {
            const salt = bcryptjs_1.default.genSaltSync(10);
            return {
                name: faker_1.faker.person.fullName(),
                email: faker_1.faker.internet.email(),
                password: bcryptjs_1.default.hashSync('123456', salt),
                role: 'user',
            };
        });
        const createdUsers = await User_1.default.insertMany(usersData);
        console.log('Users Imported!');
        // Create one admin user
        const salt = bcryptjs_1.default.genSaltSync(10);
        const adminUser = await User_1.default.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: bcryptjs_1.default.hashSync('123456', salt),
            role: 'admin',
        });
        console.log(`Admin User Imported! ID: ${adminUser._id}. Use this for ADMIN_USER_ID in backend/.env`);
        // 3. Create Products
        const productsData = Array.from({ length: 30 }, () => {
            const category = faker_1.faker.helpers.arrayElement(createdCategories);
            const price = parseFloat(faker_1.faker.commerce.price({ min: 10, max: 500 }));
            return {
                name: faker_1.faker.commerce.productName(),
                description: faker_1.faker.commerce.productDescription(),
                price: price,
                discountedPrice: faker_1.faker.datatype.boolean(0.3) ? parseFloat((price * 0.8).toFixed(2)) : undefined,
                category: category._id,
                stock: faker_1.faker.number.int({ min: 0, max: 100 }),
                images: Array.from({ length: faker_1.faker.number.int({ min: 2, max: 4 }) }, () => faker_1.faker.image.urlLoremFlickr({ category: 'technics' })),
                video: 'https://www.w3schools.com/html/mov_bbb.mp4', // Sample video
                specs: {
                    Material: faker_1.faker.commerce.productMaterial(),
                    Origin: 'Bangladesh',
                    Size: `${faker_1.faker.number.int({ min: 1, max: 100 })}cm`,
                },
                deliveryEstimateDays: faker_1.faker.number.int({ min: 2, max: 10 }),
                isAvailable: faker_1.faker.datatype.boolean(0.9),
            };
        });
        const createdProducts = await Product_1.default.insertMany(productsData);
        console.log('Products Imported!');
        // 4. Create Reviews
        const reviewsData = Array.from({ length: 100 }, () => ({
            user: faker_1.faker.helpers.arrayElement(createdUsers)._id,
            product: faker_1.faker.helpers.arrayElement(createdProducts)._id,
            rating: faker_1.faker.number.int({ min: 3, max: 5 }),
            comment: faker_1.faker.lorem.sentence(),
        }));
        await Review_1.default.insertMany(reviewsData);
        console.log('Reviews Imported!');
        // 5. Update Product Ratings based on reviews
        for (const product of createdProducts) {
            const reviews = await Review_1.default.find({ product: product._id });
            if (reviews.length > 0) {
                const avg = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
                product.ratings.count = reviews.length;
                product.ratings.average = parseFloat(avg.toFixed(2));
                await product.save();
            }
        }
        console.log('Product ratings updated!');
        console.log('Data Imported Successfully!');
    }
    catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};
const run = async () => {
    await connectDB();
    if (process.argv[2] === '-d') {
        await destroyData();
    }
    else {
        await destroyData(); // Clear before seeding
        await importData();
    }
    process.exit();
};
run();
