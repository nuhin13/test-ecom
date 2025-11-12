# BD-Sourcing API Documentation

Base URL: `http://localhost:10001/api`

## Authentication

Include JWT token in requests that require authentication:

```
Authorization: Bearer <your-jwt-token>
```

---

## Auth Endpoints

### Send OTP

Send OTP code to phone number (code printed to backend console in development).

**Endpoint:** `POST /auth/otp/send`

**Request Body:**
```json
{
  "phone": "+8801712345678"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

---

### Verify OTP

Verify OTP and login/register user.

**Endpoint:** `POST /auth/otp/verify`

**Request Body:**
```json
{
  "phone": "+8801712345678",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "...",
    "name": "User 2345",
    "phone": "+8801712345678",
    "role": "user"
  }
}
```

---

### Google Login

Authenticate with Google OAuth token (currently mocked).

**Endpoint:** `POST /auth/google`

**Request Body:**
```json
{
  "token": "google-oauth-token"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... }
}
```

---

### Get Current User

Get authenticated user profile.

**Endpoint:** `GET /auth/me`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+8801712345678",
    "role": "user",
    "address": { ... }
  }
}
```

---

## Product Endpoints

### Get All Products

Get paginated list of products with filters and sorting.

**Endpoint:** `GET /products`

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 12, max: 100)
- `search` (string) - Search in name and description
- `category` (string) - Filter by category
- `minPrice` (number) - Minimum price
- `maxPrice` (number) - Maximum price
- `minRating` (number) - Minimum average rating
- `available` (boolean) - Filter by availability
- `sortBy` (string) - `newest`, `price_asc`, `price_desc`, `rating`

**Example Request:**
```
GET /products?page=1&limit=12&category=Electronics&minPrice=50&sortBy=price_asc
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Premium Wireless Headphones",
      "description": "High-quality headphones...",
      "category": "Electronics",
      "price": 99.99,
      "discountedPrice": 79.99,
      "discountPercentage": 20,
      "images": ["https://..."],
      "video": "https://...",
      "stock": 50,
      "isAvailable": true,
      "deliveryEstimate": {
        "min": 3,
        "max": 7,
        "unit": "days"
      },
      "rating": {
        "average": 4.5,
        "count": 120
      },
      "tags": ["popular", "new arrival"],
      "sku": "BD-000001",
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ],
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

---

### Get Product by ID

Get detailed information about a specific product.

**Endpoint:** `GET /products/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Premium Wireless Headphones",
    ...
  }
}
```

---

### Get Categories

Get list of all product categories.

**Endpoint:** `GET /products/categories`

**Response:**
```json
{
  "success": true,
  "data": [
    "Electronics",
    "Clothing",
    "Home & Garden",
    "Sports & Outdoors",
    "Books & Media",
    "Toys & Games"
  ]
}
```

---

### Get Top Rated Products

Get products sorted by rating.

**Endpoint:** `GET /products/top-rated`

**Query Parameters:**
- `limit` (number, default: 10)

**Response:**
```json
{
  "success": true,
  "data": [ ... ]
}
```

---

## Cart Endpoints

### Get Cart

Get cart for current user or guest session.

**Endpoint:** `GET /cart`

**Headers:** `Authorization: Bearer <token>` (optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "user": "...",
    "items": [
      {
        "product": {
          "_id": "...",
          "name": "Product Name",
          "price": 99.99,
          ...
        },
        "quantity": 2,
        "addedAt": "2025-01-01T00:00:00.000Z"
      }
    ],
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### Add to Cart

Add product to cart.

**Endpoint:** `POST /cart/add`

**Request Body:**
```json
{
  "productId": "6584a2b5c1d2e3f4a5b6c7d8",
  "quantity": 2
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product added to cart",
  "data": { ... }
}
```

---

### Update Cart Item

Update quantity of a cart item.

**Endpoint:** `PUT /cart/update`

**Request Body:**
```json
{
  "productId": "6584a2b5c1d2e3f4a5b6c7d8",
  "quantity": 3
}
```

---

### Remove from Cart

Remove item from cart.

**Endpoint:** `DELETE /cart/remove/:productId`

---

### Clear Cart

Remove all items from cart.

**Endpoint:** `DELETE /cart/clear`

---

### Merge Cart

Merge guest cart to user cart after login.

**Endpoint:** `POST /cart/merge`

**Headers:** `Authorization: Bearer <token>` (required)

**Request Body:**
```json
{
  "sessionId": "guest-session-id"
}
```

---

## Order Endpoints

### Create Order

Create new order (requires authentication).

**Endpoint:** `POST /orders`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
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
```

**Response:**
```json
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "orderNumber": "BD-LX2P9Q-A3K5M",
    "user": "...",
    "items": [ ... ],
    "totalAmount": 199.98,
    "shippingCost": 0,
    "finalAmount": 199.98,
    "status": "confirmed",
    "paymentStatus": "paid",
    "paymentDetails": {
      "transactionId": "MOCK-1704067200000",
      "paidAt": "2025-01-01T00:00:00.000Z"
    },
    "shippingAddress": { ... },
    "estimatedDelivery": "2025-01-08T00:00:00.000Z",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### Get User Orders

Get paginated list of user's orders.

**Endpoint:** `GET /orders`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 10)

**Response:**
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": { ... }
}
```

---

### Get Order by ID

Get detailed information about a specific order.

**Endpoint:** `GET /orders/:id`

**Headers:** `Authorization: Bearer <token>`

---

### Cancel Order

Cancel an order.

**Endpoint:** `PUT /orders/:id/cancel`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "reason": "Changed my mind"
}
```

---

## Review Endpoints

### Create Review

Create product review (requires authentication).

**Endpoint:** `POST /reviews`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "product": "6584a2b5c1d2e3f4a5b6c7d8",
  "rating": 5,
  "comment": "Excellent product! Highly recommended.",
  "images": ["https://example.com/review-image.jpg"]
}
```

---

### Get Product Reviews

Get reviews for a specific product.

**Endpoint:** `GET /reviews/product/:productId`

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 10)
- `sortBy` (string) - `newest`, `helpful`, `rating_high`, `rating_low`

---

### Update Review

Update own review.

**Endpoint:** `PUT /reviews/:id`

**Headers:** `Authorization: Bearer <token>`

---

### Delete Review

Delete own review.

**Endpoint:** `DELETE /reviews/:id`

**Headers:** `Authorization: Bearer <token>`

---

## User Endpoints

### Get User Profile

Get user profile information.

**Endpoint:** `GET /users/profile`

**Headers:** `Authorization: Bearer <token>`

---

### Update User Profile

Update user profile.

**Endpoint:** `PUT /users/profile`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+8801712345678",
  "avatar": "https://...",
  "address": {
    "street": "123 Main St",
    "city": "Dhaka",
    "state": "Dhaka Division",
    "zipCode": "1200",
    "country": "Bangladesh"
  }
}
```

---

## Admin Endpoints

All admin endpoints require `x-admin-secret` header:

```
x-admin-secret: your-admin-secret-key
```

### Create Product

**Endpoint:** `POST /admin/products`

**Request Body:**
```json
{
  "name": "New Product",
  "description": "Product description",
  "category": "Electronics",
  "price": 99.99,
  "discountedPrice": 79.99,
  "images": ["https://..."],
  "video": "https://...",
  "stock": 50,
  "sku": "NP-001"
}
```

---

### Update Product

**Endpoint:** `PUT /admin/products/:id`

---

### Delete Product

**Endpoint:** `DELETE /admin/products/:id`

---

### Get All Orders

**Endpoint:** `GET /admin/orders`

**Query Parameters:**
- `page` (number)
- `limit` (number)
- `status` (string)

---

### Update Order Status

**Endpoint:** `PUT /admin/orders/:id/status`

**Request Body:**
```json
{
  "status": "shipped",
  "trackingNumber": "TRACK123456"
}
```

---

### Get All Users

**Endpoint:** `GET /admin/users`

---

### Update User Role

**Endpoint:** `PUT /admin/users/:id/role`

**Request Body:**
```json
{
  "role": "admin"
}
```

---

## Error Responses

All endpoints may return error responses in this format:

```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "field": "fieldName",
      "message": "Field error message"
    }
  ]
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting

API is rate limited to 100 requests per 15 minutes per IP address.

---

## Testing with cURL

### Example: Create Order

```bash
curl -X POST http://localhost:10001/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "items": [{"product": "PRODUCT_ID", "quantity": 1}],
    "shippingAddress": {
      "name": "John Doe",
      "phone": "+8801712345678",
      "street": "123 Main St",
      "city": "Dhaka",
      "state": "Dhaka Division",
      "zipCode": "1200",
      "country": "Bangladesh"
    },
    "paymentMethod": "mock"
  }'
```

### Example: Admin Create Product

```bash
curl -X POST http://localhost:10001/api/admin/products \
  -H "Content-Type: application/json" \
  -H "x-admin-secret: your-admin-secret-key" \
  -d '{
    "name": "Test Product",
    "description": "Test description",
    "category": "Electronics",
    "price": 99.99,
    "images": ["https://picsum.photos/600"],
    "stock": 100,
    "sku": "TEST-001"
  }'
```
