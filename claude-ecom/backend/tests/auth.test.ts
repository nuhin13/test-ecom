import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';
import { User } from '../src/models/User';

describe('Auth API', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:10000/bd-sourcing-test');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/auth/otp/send', () => {
    it('should send OTP to valid phone number', async () => {
      const response = await request(app)
        .post('/api/auth/otp/send')
        .send({ phone: '+8801712345678' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('OTP sent');
    });

    it('should return error for invalid phone number', async () => {
      const response = await request(app).post('/api/auth/otp/send').send({ phone: '123' }).expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/otp/verify', () => {
    it('should return error for invalid OTP', async () => {
      const response = await request(app)
        .post('/api/auth/otp/verify')
        .send({ phone: '+8801712345678', otp: '000000' })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return 401 without authentication', async () => {
      const response = await request(app).get('/api/auth/me').expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});
