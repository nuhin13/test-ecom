# BD-Sourcing E-Commerce Platform

A complete, production-ready B2C e-commerce platform built with Next.js, Express, TypeScript, MongoDB, and Docker.

## 🚀 Features

### Frontend (Next.js + TypeScript + Tailwind CSS)
- **Home Page**: Banner slider, offers section, category rows, top-rated products, customer feedback, FAQ
- **Product Listing**: Server-side pagination, search, filters (category, price, rating, availability), sorting
- **Product Detail**: Image gallery, video preview, full description, specifications, reviews, add to cart
- **Shopping Cart**: Quantity management, guest & user carts, cart merging after login
- **Checkout**: Login modal with Google OAuth or Phone OTP, order placement
- **User Dashboard**: Profile management, order history, order details
- **Responsive**: Mobile-first design with Tailwind CSS

### Backend (Node.js + Express + TypeScript + MongoDB)
- **RESTful API**: Complete CRUD operations for products, orders, users, reviews, cart
- **Authentication**: NextAuth for Google OAuth, Mock OTP service for phone auth, JWT tokens
- **Validation**: Zod schema validation on all endpoints
- **Security**: Helmet, CORS, rate limiting, input sanitization, MongoDB injection protection
- **Cart Management**: Session-based cart for guests, DB cart for authenticated users, cart merging
- **Mock Payment**: Placeholder for Stripe integration
- **Admin Routes**: Protected admin endpoints for product/user/order/slider management

### Database & Seeding
- **MongoDB**: Mongoose schemas with proper indexes and relationships
- **Seed Script**: Generates 30 products, 10 users, 100 reviews, 3 sliders
- **Categories**: 6 product categories with sample data

### DevOps
- **Docker**: Complete containerization with docker-compose for frontend, backend, and MongoDB
- **Environment Variables**: Comprehensive .env.example for configuration
- **Testing**: Jest + Supertest for backend API testing
- **Code Quality**: ESLint, Prettier, TypeScript strict mode

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Environment Setup](#environment-setup)
4. [Database Seeding](#database-seeding)
5. [Running the Project](#running-the-project)
6. [Testing](#testing)
7. [API Documentation](#api-documentation)
8. [Project Structure](#project-structure)
9. [Manual Testing Checklist](#manual-testing-checklist)
10. [Mocked Features](#mocked-features)
11. [Production Deployment](#production-deployment)

---

## Prerequisites

- **Node.js**: v18+ and npm/yarn
- **MongoDB**: v6+ (local or Docker)
- **Docker**: v20+ and Docker Compose (optional but recommended)

---

## Installation

### Option 1: Using Docker (Recommended)

```bash
# 1. Clone the repository
git clone <repository-url>
cd bd-sourcing

# 2. Copy environment variables
cp .env.example .env

# 3. Edit .env file with your credentials (especially Google OAuth if needed)

# 4. Install dependencies for seeding
cd scripts
npm install
cd ..

# 5. Start services with Docker Compose
docker-compose up -d

# 6. Wait for services to start (check with docker-compose ps)

# 7. Seed the database
cd scripts
npm run seed
cd ..
```

### Option 2: Local Development

```bash
# 1. Clone the repository
git clone <repository-url>
cd bd-sourcing

# 2. Install backend dependencies
cd backend
npm install
cd ..

# 3. Install frontend dependencies
cd frontend
npm install
cd ..

# 4. Install scripts dependencies
cd scripts
npm install
cd ..

# 5. Copy environment variables
cp .env.example .env

# 6. Edit .env with your MongoDB URI and other settings

# 7. Start MongoDB (if not using Docker)
# Make sure MongoDB is running on mongodb://localhost:10000

# 8. Seed the database
cd scripts
npm run seed
cd ..

# 9. Start backend (in one terminal)
cd backend
npm run dev

# 10. Start frontend (in another terminal)
cd frontend
npm run dev
```

---

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# Backend Configuration
NODE_ENV=development
PORT=10001
MONGODB_URI=mongodb://mongo:27017/bd-sourcing  # Use localhost:10000 if not using Docker

# Frontend Configuration
NEXT_PUBLIC_API_URL=http://localhost:10001/api
NEXTAUTH_URL=http://localhost:10002
NEXTAUTH_SECRET=your-nextauth-secret-change-in-production

# Google OAuth (Get from Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# OTP Service (Mock - currently prints to console)
OTP_SERVICE_ENABLED=true
OTP_EXPIRY_MINUTES=10

# Admin Credentials
ADMIN_EMAIL=admin@bd-sourcing.com
ADMIN_SECRET=your-admin-secret-key

# JWT
JWT_SECRET=your-jwt-secret-change-in-production
JWT_EXPIRY=7d

# CORS
ALLOWED_ORIGINS=http://localhost:10002,http://localhost:10003

# Payment (Mock - for future Stripe integration)
STRIPE_PUBLIC_KEY=pk_test_mock
STRIPE_SECRET_KEY=sk_test_mock
```

**Important Notes:**
- For **Google OAuth**, create credentials at [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
- For **production**, change all secret keys to secure random strings
- The **OTP service** is mocked and prints OTP codes to the backend console

---

## Database Seeding

The seed script creates sample data for testing:

```bash
cd scripts
npm run seed
```

**What gets created:**
- **10 Users**: 1 admin (user1@example.com) + 9 regular users
- **30 Products**: Across 6 categories with images, prices, stock
- **100 Reviews**: Random reviews distributed across products
- **3 Sliders**: Banner images for homepage

**Note**: The script clears existing data before seeding!

---

## Running the Project

### With Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild after code changes
docker-compose up -d --build
```

**Access URLs:**
- Frontend: http://localhost:10002
- Backend API: http://localhost:10001
- MongoDB: mongodb://localhost:10000

### Local Development

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

**Access URLs:**
- Frontend: http://localhost:10002
- Backend API: http://localhost:10001

---

## Testing

### Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm test -- --coverage
```

### Manual Testing

See [Manual Testing Checklist](#manual-testing-checklist) below.

---

## API Documentation

### Base URL
```
http://localhost:10001/api
```

### Authentication

All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### Endpoints

#### Auth API

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/otp/send` | Send OTP to phone | No |
| POST | `/auth/otp/verify` | Verify OTP and login | No |
| POST | `/auth/google` | Google OAuth login | No |
| GET | `/auth/me` | Get current user | Yes |
| POST | `/auth/logout` | Logout user | No |

**Example: Send OTP**
```bash
POST /api/auth/otp/send
Content-Type: application/json

{
  "phone": "+8801712345678"
}

Response:
{
  "success": true,
  "message": "OTP sent successfully"
}

# Check backend console for OTP code (mocked)
```

**Example: Verify OTP**
```bash
POST /api/auth/otp/verify
Content-Type: application/json

{
  "phone": "+8801712345678",
  "otp": "123456"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1...",
  "user": { ... }
}
```

#### Products API

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/products` | Get all products (paginated) | No |
| GET | `/products/:id` | Get product by ID | No |
| GET | `/products/categories` | Get all categories | No |
| GET | `/products/top-rated` | Get top rated products | No |
| GET | `/products/category/:category` | Get products by category | No |

**Example: Get Products with Filters**
```bash
GET /api/products?page=1&limit=12&category=Electronics&minPrice=50&maxPrice=200&sortBy=price_asc

Response:
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalItems": 30,
    "itemsPerPage": 12,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

#### Cart API

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/cart` | Get user/guest cart | Optional |
| POST | `/cart/add` | Add product to cart | Optional |
| PUT | `/cart/update` | Update cart item quantity | Optional |
| DELETE | `/cart/remove/:productId` | Remove item from cart | Optional |
| DELETE | `/cart/clear` | Clear cart | Optional |
| POST | `/cart/merge` | Merge guest cart to user cart | Yes |

**Example: Add to Cart**
```bash
POST /api/cart/add
Content-Type: application/json

{
  "productId": "6584a2b5c1d2e3f4a5b6c7d8",
  "quantity": 2
}

Response:
{
  "success": true,
  "message": "Product added to cart",
  "data": { ... }
}
```

#### Orders API

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/orders` | Create new order | Yes |
| GET | `/orders` | Get user orders | Yes |
| GET | `/orders/:id` | Get order by ID | Yes |
| PUT | `/orders/:id/cancel` | Cancel order | Yes |

**Example: Create Order**
```bash
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "product": "6584a2b5c1d2e3f4a5b6c7d8",
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "name": "John Doe",
    "phone": "+8801712345678",
    "street": "123 Main St",
    "city": "Dhaka",
    "state": "Dhaka Division",
    "zipCode": "1200",
    "country": "Bangladesh"
  },
  "paymentMethod": "mock",
  "notes": "Please call before delivery"
}

Response:
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "orderNumber": "BD-LX2P9Q-A3K5M",
    ...
  }
}
```

#### Reviews API

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/reviews` | Create review | Yes |
| GET | `/reviews/product/:productId` | Get product reviews | No |
| PUT | `/reviews/:id` | Update review | Yes |
| DELETE | `/reviews/:id` | Delete review | Yes |

**Example: Create Review**
```bash
POST /api/reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "product": "6584a2b5c1d2e3f4a5b6c7d8",
  "rating": 5,
  "comment": "Excellent product! Highly recommended.",
  "images": ["https://example.com/review-image.jpg"]
}

Response:
{
  "success": true,
  "message": "Review created successfully",
  "data": { ... }
}
```

#### User API

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users/profile` | Get user profile | Yes |
| PUT | `/users/profile` | Update user profile | Yes |

#### Admin API

**All admin endpoints require `x-admin-secret` header**

| Method | Endpoint | Description | Admin Secret Required |
|--------|----------|-------------|----------------------|
| POST | `/admin/products` | Create product | Yes |
| PUT | `/admin/products/:id` | Update product | Yes |
| DELETE | `/admin/products/:id` | Delete product | Yes |
| GET | `/admin/orders` | Get all orders | Yes |
| PUT | `/admin/orders/:id/status` | Update order status | Yes |
| GET | `/admin/users` | Get all users | Yes |
| PUT | `/admin/users/:id/role` | Update user role | Yes |
| POST | `/admin/sliders` | Create slider | Yes |
| GET | `/admin/sliders` | Get sliders | Yes |
| PUT | `/admin/sliders/:id` | Update slider | Yes |
| DELETE | `/admin/sliders/:id` | Delete slider | Yes |

**Example: Create Product (Admin)**
```bash
POST /api/admin/products
x-admin-secret: your-admin-secret-key
Content-Type: application/json

{
  "name": "New Product",
  "description": "Product description",
  "category": "Electronics",
  "price": 99.99,
  "images": ["https://example.com/image.jpg"],
  "stock": 50,
  "sku": "NP-001"
}

Response:
{
  "success": true,
  "message": "Product created successfully",
  "data": { ... }
}
```

---

## Project Structure

```
bd-sourcing/
├── backend/                 # Express API server
│   ├── src/
│   │   ├── config/         # Database and environment config
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Auth, validation, error handling
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Helper functions
│   │   ├── validators/     # Zod validation schemas
│   │   ├── types/          # TypeScript type definitions
│   │   ├── app.ts          # Express app setup
│   │   └── index.ts        # Server entry point
│   ├── tests/              # Jest + Supertest tests
│   ├── Dockerfile
│   └── package.json
│
├── frontend/               # Next.js application
│   ├── src/
│   │   ├── app/           # Next.js 14 App Router pages
│   │   ├── components/    # React components
│   │   ├── lib/           # API client, utilities
│   │   ├── types/         # TypeScript interfaces
│   │   └── context/       # React context providers
│   ├── public/            # Static assets
│   ├── Dockerfile
│   └── package.json
│
├── scripts/               # Database seeding scripts
│   ├── seed.ts
│   └── package.json
│
├── docker-compose.yml     # Docker orchestration
├── .env.example           # Environment variables template
├── .gitignore
└── README.md
```

---

## Manual Testing Checklist

After starting the project, test these key flows:

### ✅ Basic Functionality
1. **Home Page Loads**: Visit http://localhost:10002 and verify banner, categories, and top-rated products appear
2. **Browse Products**: Navigate to Products page, verify pagination and product cards display
3. **Search Products**: Use search bar to find products by name
4. **Filter Products**: Apply category, price range, and rating filters
5. **Sort Products**: Test sorting by newest, price (asc/desc), and rating

### ✅ Product Details
6. **View Product**: Click on a product to see details, images, specs, and reviews
7. **Add to Cart (Guest)**: Add product to cart without logging in
8. **Cart Badge Updates**: Verify cart icon shows item count

### ✅ Authentication
9. **Phone OTP Flow**:
   - Click "Login" or try to checkout
   - Enter phone number
   - Check backend console for OTP code
   - Enter OTP to login
10. **Google OAuth**: Test Google sign-in (requires valid OAuth credentials)

### ✅ Cart & Checkout
11. **View Cart**: Navigate to cart page, verify items and totals
12. **Update Quantity**: Change item quantities in cart
13. **Remove Items**: Delete items from cart
14. **Checkout Flow**:
    - Proceed to checkout
    - Verify login prompt for guests
    - Fill shipping address
    - Place order
15. **Order Confirmation**: Verify order number and details

### ✅ User Dashboard
16. **View Profile**: Navigate to dashboard, check user info
17. **Order History**: View list of orders
18. **Order Details**: Click on an order to see full details
19. **Edit Profile**: Update name, email, address

### ✅ Reviews
20. **Write Review**: On a product page, submit a review (requires login)
21. **View Reviews**: See reviews on product pages with pagination
22. **Verified Purchase Badge**: Check if review shows verified purchase indicator

### ✅ Admin Functions
23. **Create Product**: Use Postman/curl with admin secret to create a product
24. **Update Product**: Modify product details via admin API
25. **Manage Orders**: View all orders and update order status

---

## Mocked Features

The following features are mocked for development and should be replaced in production:

### 🔴 Phone OTP Service
- **Current**: Prints OTP to backend console
- **Replace with**: Twilio, AWS SNS, or other SMS service
- **Location**: `backend/src/utils/otpService.ts`

### 🔴 Google OAuth
- **Current**: Mock token verification
- **Replace with**: Real Google OAuth verification using `google-auth-library`
- **Location**: `backend/src/controllers/auth.controller.ts` → `googleLogin` function

### 🔴 Payment Processing
- **Current**: Mock payment that auto-confirms orders
- **Replace with**: Stripe, PayPal, or other payment gateway
- **Location**:
  - Backend: `backend/src/controllers/order.controller.ts`
  - Frontend: Create Stripe checkout component

### 🔴 Image/Video Upload
- **Current**: Uses placeholder URLs
- **Replace with**: AWS S3, Cloudinary, or other storage service
- **Implementation**: Add file upload endpoints and frontend upload component

### 🔴 Email Notifications
- **Current**: Not implemented
- **Add**: SendGrid, AWS SES for order confirmations, password resets, etc.

---

## Production Deployment

### Environment Variables

Update `.env` for production:
- Set `NODE_ENV=production`
- Use strong, random secrets for `JWT_SECRET`, `NEXTAUTH_SECRET`, `ADMIN_SECRET`
- Configure real MongoDB URI (MongoDB Atlas recommended)
- Add real Google OAuth credentials
- Configure CORS to allow only your production domain

### Security Checklist

- [ ] Enable HTTPS/SSL certificates
- [ ] Set up proper CORS origins
- [ ] Use environment-specific secrets
- [ ] Enable MongoDB authentication
- [ ] Set up rate limiting on production
- [ ] Configure helmet security headers
- [ ] Enable logging and monitoring
- [ ] Set up backup strategy for MongoDB
- [ ] Implement proper error tracking (Sentry, etc.)

### Docker Production Build

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Run in production mode
docker-compose -f docker-compose.prod.yml up -d
```

### Next.js Production Build

```bash
cd frontend
npm run build
npm start
```

### Recommended Hosting

- **Frontend**: Vercel, Netlify, or AWS Amplify
- **Backend**: AWS ECS, Google Cloud Run, or DigitalOcean App Platform
- **Database**: MongoDB Atlas
- **CDN**: Cloudflare for static assets

---

## Additional Notes

### Port Configuration

- Frontend: `10002`
- Backend: `10001`
- MongoDB: `10000` (mapped from internal 27017)

Change ports in `.env` and `docker-compose.yml` if needed.

### Database Indexes

The following indexes are created automatically by Mongoose:
- Products: name, category, price, rating, createdAt
- Users: email, phone, provider+providerId
- Orders: user, orderNumber, status
- Reviews: product+user (unique compound), product+createdAt
- Cart: user (unique), sessionId (unique)

### Performance Optimization

- Use pagination for all list endpoints
- Images are lazy-loaded on frontend
- MongoDB queries use lean() for better performance
- Response compression enabled
- Static assets cached

---

## Troubleshooting

### MongoDB Connection Issues

```bash
# Check if MongoDB is running
docker-compose ps

# View MongoDB logs
docker-compose logs mongo

# Restart MongoDB
docker-compose restart mongo
```

### Port Already in Use

```bash
# Find process using port 10001
lsof -i :10001
# Kill the process
kill -9 <PID>
```

### Docker Build Issues

```bash
# Remove all containers and rebuild
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

---

## License

MIT

---

## Support

For issues and questions:
- Create an issue in the repository
- Email: support@bd-sourcing.com

---

**Generated with Claude Code** 🤖
