import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from parent directory
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:10000/bd-sourcing';

// Define schemas (simplified versions from backend models)
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  password: String,
  provider: String,
  providerId: String,
  avatar: String,
  role: { type: String, default: 'user' },
  isActive: { type: Boolean, default: true },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  specifications: mongoose.Schema.Types.Mixed,
  category: String,
  price: Number,
  discountedPrice: Number,
  discountPercentage: Number,
  images: [String],
  video: String,
  stock: Number,
  isAvailable: Boolean,
  deliveryEstimate: {
    min: Number,
    max: Number,
    unit: String,
  },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
  },
  tags: [String],
  sku: String,
}, { timestamps: true });

const reviewSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rating: Number,
  comment: String,
  images: [String],
  isVerifiedPurchase: Boolean,
  helpful: Number,
}, { timestamps: true });

const sliderSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  link: String,
  order: Number,
  isActive: Boolean,
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const Review = mongoose.model('Review', reviewSchema);
const Slider = mongoose.model('Slider', sliderSchema);

const categories = [
  'Electronics',
  'Clothing',
  'Home & Garden',
  'Sports & Outdoors',
  'Books & Media',
  'Toys & Games',
];

const productNames = [
  'Premium Wireless Headphones',
  'Smart LED TV 55 inch',
  'Leather Wallet',
  'Running Shoes',
  'Coffee Maker',
  'Yoga Mat',
  'Gaming Mouse',
  'Backpack',
  'Sunglasses',
  'Water Bottle',
  'Bluetooth Speaker',
  'Fitness Tracker',
  'Desk Lamp',
  'Phone Case',
  'Camera Tripod',
  'Kitchen Knife Set',
  'Travel Pillow',
  'USB Cable',
  'Desk Organizer',
  'Plant Pot',
  'Notebook Set',
  'Portable Charger',
  'Desk Chair',
  'Wall Clock',
  'Cutting Board',
  'Shower Curtain',
  'Bath Towel',
  'Pillow',
  'Blanket',
  'Table Lamp',
];

const firstNames = ['John', 'Jane', 'Mike', 'Sarah', 'David', 'Emma', 'James', 'Olivia', 'Robert', 'Sophia'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];

const reviews = [
  'Excellent product! Highly recommended.',
  'Good quality for the price.',
  'Arrived quickly and well packaged.',
  'Exactly as described. Very satisfied.',
  'Great value for money.',
  'Could be better, but acceptable.',
  'Not what I expected, but still useful.',
  'Amazing quality! Will buy again.',
  'Works perfectly. Very happy with purchase.',
  'Good product but delivery was slow.',
];

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Product.deleteMany({}),
      Review.deleteMany({}),
      Slider.deleteMany({}),
    ]);
    console.log('Existing data cleared');

    // Create users
    console.log('Creating users...');
    const users = [];
    for (let i = 0; i < 10; i++) {
      const user = await User.create({
        name: `${firstNames[i]} ${lastNames[i]}`,
        email: `user${i + 1}@example.com`,
        phone: `+88017${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
        provider: 'email',
        avatar: `https://i.pravatar.cc/150?img=${i + 1}`,
        role: i === 0 ? 'admin' : 'user',
        address: {
          street: `${i + 1}23 Main Street`,
          city: 'Dhaka',
          state: 'Dhaka Division',
          zipCode: `${1200 + i}`,
          country: 'Bangladesh',
        },
      });
      users.push(user);
    }
    console.log(`Created ${users.length} users`);

    // Create products
    console.log('Creating products...');
    const products = [];
    for (let i = 0; i < 30; i++) {
      const category = categories[i % categories.length];
      const price = Math.floor(Math.random() * 200) + 20;
      const hasDiscount = Math.random() > 0.5;
      const discountedPrice = hasDiscount ? Math.floor(price * (0.7 + Math.random() * 0.2)) : undefined;

      const product = await Product.create({
        name: productNames[i],
        description: `High-quality ${productNames[i].toLowerCase()} perfect for everyday use. Made with premium materials and designed to last.`,
        specifications: {
          Brand: 'BD-Source',
          Material: 'Premium Quality',
          Warranty: '1 Year',
          Color: ['Black', 'White', 'Blue'][Math.floor(Math.random() * 3)],
        },
        category,
        price,
        discountedPrice,
        discountPercentage: hasDiscount ? Math.round(((price - discountedPrice!) / price) * 100) : undefined,
        images: [
          `https://picsum.photos/seed/${i}/600/600`,
          `https://picsum.photos/seed/${i + 100}/600/600`,
          `https://picsum.photos/seed/${i + 200}/600/600`,
        ],
        video: i % 3 === 0 ? `https://example.com/video${i}.mp4` : undefined,
        stock: Math.floor(Math.random() * 100) + 10,
        isAvailable: true,
        deliveryEstimate: {
          min: 3,
          max: 7,
          unit: 'days',
        },
        rating: {
          average: 0,
          count: 0,
        },
        tags: ['popular', 'new arrival', 'best seller'].slice(0, Math.floor(Math.random() * 3) + 1),
        sku: `BD-${String(i + 1).padStart(6, '0')}`,
      });
      products.push(product);
    }
    console.log(`Created ${products.length} products`);

    // Create reviews
    console.log('Creating reviews...');
    const createdReviews = [];
    for (let i = 0; i < 100; i++) {
      const product = products[Math.floor(Math.random() * products.length)];
      const user = users[Math.floor(Math.random() * users.length)];

      // Check if user already reviewed this product
      const existing = createdReviews.find(
        (r: any) => r.product.toString() === product._id.toString() && r.user.toString() === user._id.toString()
      );

      if (existing) {
        continue; // Skip duplicate reviews
      }

      const review = await Review.create({
        product: product._id,
        user: user._id,
        rating: Math.floor(Math.random() * 3) + 3, // 3-5 stars
        comment: reviews[Math.floor(Math.random() * reviews.length)],
        images: Math.random() > 0.7 ? [`https://picsum.photos/seed/${i}/400/400`] : [],
        isVerifiedPurchase: Math.random() > 0.3,
        helpful: Math.floor(Math.random() * 20),
      });
      createdReviews.push(review);
    }
    console.log(`Created ${createdReviews.length} reviews`);

    // Update product ratings
    console.log('Updating product ratings...');
    for (const product of products) {
      const productReviews = createdReviews.filter(
        (r: any) => r.product.toString() === product._id.toString()
      );

      if (productReviews.length > 0) {
        const totalRating = productReviews.reduce((sum: number, r: any) => sum + r.rating, 0);
        const avgRating = totalRating / productReviews.length;

        await Product.findByIdAndUpdate(product._id, {
          'rating.average': Math.round(avgRating * 10) / 10,
          'rating.count': productReviews.length,
        });
      }
    }
    console.log('Product ratings updated');

    // Create sliders
    console.log('Creating sliders...');
    await Slider.create([
      {
        title: 'Summer Sale',
        description: 'Up to 50% off on selected items',
        image: 'https://picsum.photos/seed/banner1/1200/400',
        link: '/products?sale=true',
        order: 1,
        isActive: true,
      },
      {
        title: 'New Arrivals',
        description: 'Check out our latest products',
        image: 'https://picsum.photos/seed/banner2/1200/400',
        link: '/products?sort=newest',
        order: 2,
        isActive: true,
      },
      {
        title: 'Free Shipping',
        description: 'On orders over $50',
        image: 'https://picsum.photos/seed/banner3/1200/400',
        link: '/products',
        order: 3,
        isActive: true,
      },
    ]);
    console.log('Created 3 sliders');

    console.log('\n✅ Database seeded successfully!');
    console.log(`\nSummary:`);
    console.log(`- Users: ${users.length}`);
    console.log(`- Products: ${products.length}`);
    console.log(`- Reviews: ${createdReviews.length}`);
    console.log(`- Sliders: 3`);
    console.log(`\nAdmin user: user1@example.com`);

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

seed();
