# BD-Sourcing: A Full-Stack B2C E-Commerce Platform

This repository contains the complete source code for BD-Sourcing, a production-ready scaffold for a B2C product-sourcing e-commerce website. It includes a Next.js frontend, a Node.js/Express backend, database seeding scripts, and full Docker containerization.

## Project Structure

```
.
├── backend/         # Node.js, Express, MongoDB Backend
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── docs/
│   └── api.md       # API endpoint documentation
├── frontend/        # Next.js, Tailwind CSS Frontend
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   └── package.json
├── scripts/         # Database seeding script
│   └── seed.ts
├── .gitignore
├── docker-compose.yml # Main Docker Compose file
└── README.md        # This file
```

## Tech Stack

- **Frontend:** Next.js (v14) with App Router, TypeScript, Tailwind CSS, NextAuth.js
- **Backend:** Node.js, Express, TypeScript, Mongoose, Zod (for validation)
- **Database:** MongoDB
- **Authentication:** JWT (session-based), Google OAuth, Mocked Phone OTP
- **Containerization:** Docker & Docker Compose
- **Linting/Formatting:** ESLint & Prettier

---

## Getting Started

Follow these steps to get the entire application running on your local machine.

### Prerequisites

- [Docker](https://www.docker.com/get-started) and Docker Compose
- [Node.js](https://nodejs.org/en/) (v18 or higher) and `yarn` or `npm`
- A Google Cloud project with OAuth 2.0 credentials enabled.

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. Set Up Environment Variables

The project uses `.env` files for environment variables. Examples are provided.

**A. Create the main `.env` file for Docker Compose:**

Create a file named `.env` in the project root and add the following, replacing the placeholder values:

```env
# For NextAuth.js
NEXTAUTH_SECRET=generate-a-strong-secret-here # e.g., openssl rand -hex 32
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# For Backend JWT
JWT_SECRET=another-strong-secret-for-backend-jwt

# For Admin User (will be updated after seeding)
ADMIN_USER_ID=placeholder
```

**B. Copy example files for local development (optional):**

If you plan to run services outside of Docker, copy the `.env.example` files:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```
Then, fill in the values in those files.

### 3. Install Dependencies

Install dependencies for all services. This is necessary for your IDE to resolve imports and for running the seed script.

```bash
# Install backend dependencies
cd backend && npm install && cd ..

# Install frontend dependencies
cd frontend && npm install && cd ..

# Install seeder script dependencies
cd scripts && npm install && cd ..
```

### 4. Run the Database Seeder

This script will populate the MongoDB database with sample categories, users, products, and reviews.

First, start the MongoDB service using Docker Compose:
```bash
docker-compose up -d mongo
```

Wait a few seconds for the database to initialize, then run the seed script:
```bash
cd scripts
npm start
```

After the script runs, it will print the ID of the created **Admin User**. **Copy this ID** and paste it as the value for `ADMIN_USER_ID` in the root `.env` file.

```env
# .env
ADMIN_USER_ID=paste-the-admin-user-id-here
```

### 5. Run the Application with Docker Compose

Now, bring up the entire application stack.

```bash
docker-compose up --build
```

- Frontend will be available at: `http://localhost:3000`
- Backend API will be available at: `http://localhost:5001`

---

## Manual Testing Checklist

After starting the project, perform these checks to ensure core functionality is working:

1.  **Homepage:** Verify that the hero slider, category rows, and top-rated product sections load with placeholder images and data.
2.  **Product Listing:** Navigate to the "All Products" page. Check if the initial set of products is displayed.
3.  **Product Filtering/Searching (UI Stubbed):** Use the search bar and filter placeholders to see how the URL changes, even if the logic isn't fully wired in the UI.
4.  **Product Details:** Click on a product. Ensure the detail page loads with its gallery, description, and specs.
5.  **Add to Cart:** From the product detail page, add an item to the cart. A success toast should appear, and the cart icon in the header should update its count.
6.  **Guest Cart:** View the cart page as a guest. Modify item quantities or remove an item. The subtotal should update correctly.
7.  **User Registration/Login:**
    - Sign in using the Google option. You should be redirected to the dashboard.
    - Sign out, then try the mocked OTP login with any phone number and any OTP value.
8.  **Checkout Flow:** As a logged-in user, proceed to the checkout page from the cart. Click "Place Order." The order should be created, the cart should clear, and you should be redirected to the order detail page.
9.  **User Dashboard:** Navigate to the dashboard. Check if your name is displayed. Go to "My Orders" to see the order you just placed.
10. **Admin Access (Conceptual):** While there is no admin UI, the backend routes under `/api/admin/*` are protected. You can conceptually verify this by trying to access them without being the admin user.

---
## Mocked Features & Future Integrations

- **Phone OTP Service:** The OTP login is mocked. In `backend/src/controllers/authController.ts`, replace the `loginWithOTP` logic with a real OTP service like Twilio Verify.
- **Payment Gateway:** The checkout process is mocked. The `handlePlaceOrder` function in `frontend/src/app/(main)/(routes)/checkout/page.tsx` is the placeholder for integrating a real payment gateway like Stripe.
- **Cart Merging:** The logic to merge a guest's session cart with a user's database cart upon login needs to be implemented. A good place for this would be in the `signIn` callback in `frontend/src/lib/authOptions.ts`.
- **Admin Dashboard:** The project includes protected admin API endpoints but no admin-facing UI. A separate React or Next.js application could be built to consume these endpoints.
