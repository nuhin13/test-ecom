import dotenv from 'dotenv';

dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '10001', 10),
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:10000/bd-sourcing',

  // JWT
  jwtSecret: process.env.JWT_SECRET || 'your-jwt-secret-change-in-production',
  jwtExpiry: process.env.JWT_EXPIRY || '7d',

  // NextAuth
  nextAuthSecret: process.env.NEXTAUTH_SECRET || 'your-nextauth-secret-change-in-production',

  // Admin
  adminEmail: process.env.ADMIN_EMAIL || 'admin@bd-sourcing.com',
  adminSecret: process.env.ADMIN_SECRET || 'your-admin-secret-key',

  // CORS
  allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:10002').split(','),

  // OTP
  otpServiceEnabled: process.env.OTP_SERVICE_ENABLED === 'true',
  otpExpiryMinutes: parseInt(process.env.OTP_EXPIRY_MINUTES || '10', 10),

  // Pagination
  defaultPageSize: parseInt(process.env.DEFAULT_PAGE_SIZE || '12', 10),
  maxPageSize: parseInt(process.env.MAX_PAGE_SIZE || '100', 10),

  // File Upload
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10), // 5MB
  allowedFileTypes: (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/webp,video/mp4').split(','),
};
