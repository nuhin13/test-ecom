# BD-Sourcing API Documentation

This document provides a summary of the core API endpoints for the BD-Sourcing platform.

## Base URL

`/api`

---

## Authentication (`/api/auth`)

### `POST /register`
Register a new user.
- **Body:** `{ "name": "string", "email": "string", "password": "string" }`
- **Response:** `{ "_id", "name", "email", "token" }`

### `POST /login`
Login an existing user.
- **Body:** `{ "email": "string", "password": "string" }`
- **Response:** `{ "_id", "name", "email", "token" }`

### `POST /login-otp` (Mocked)
Login or register a user with a phone number.
- **Body:** `{ "phone": "string", "otp": "string" }`
- **Response:** `{ "_id", "name", "email", "token" }`

### `GET /me`
Get the profile of the currently authenticated user.
- **Auth:** Bearer Token required.
- **Response:** User object.

---

## Products (`/api/products`)

### `GET /`
Get a list of all products with filtering, sorting, and pagination.
- **Query Params:**
  - `page`: number
  - `limit`: number
  - `sort`: string (e.g., `-createdAt`, `price`, `-price`)
  - `category`: string (slug)
  - `priceMin`, `priceMax`: number
  - `rating`: number
  - `availability`: boolean
  - `search`: string
- **Response:** `{ products: [], page, pages, count }`

### `GET /categories`
Get all product categories.
- **Response:** `[ { "_id", "name", "slug", "image" } ]`

### `GET /:id`
Get a single product by its ID.
- **Response:** Product object.

### `GET /:id/reviews`
Get all reviews for a specific product.
- **Response:** `[ { "_id", "user", "rating", "comment" } ]`

### `POST /:id/reviews`
Create a new review for a product.
- **Auth:** Bearer Token required.
- **Body:** `{ "rating": number, "comment": "string" }`
- **Response:** `{ "message": "Review added" }`

---

## Orders (`/api/orders`)

### `POST /`
Create a new order.
- **Auth:** Bearer Token required.
- **Body:** `{ "items": [{ "productId", "quantity" }], "shippingAddress": { ... } }`
- **Response:** Order object.

### `GET /myorders`
Get all orders for the logged-in user.
- **Auth:** Bearer Token required.
- **Response:** `[ Order ]`

### `GET /:id`
Get a single order by ID.
- **Auth:** Bearer Token required.
- **Response:** Order object.

---

## Admin (`/api/admin`)
**Note:** All admin routes require authentication and admin privileges.

### `POST /products`
Create a new product.

### `PUT /products/:id`
Update an existing product.

### `DELETE /products/:id`
Delete a product.

### `POST /categories`
Create a new category.

### `GET /users`
Get a list of all users.

### `GET /orders`
Get a list of all orders in the system.
