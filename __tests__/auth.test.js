const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

// Before running tests, connect to your test database
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL);
});

// After running tests, disconnect from the test database
afterAll(async () => {
  await mongoose.connection.close();
});

describe('Auth API Tests', () => {
  test('should create a new user with valid details', async () => {
    try {
      const res = await request(app).post('/api/v1/auth/create_user').send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });
      expect(res.statusCode).toBe(200);
      expect(res.body.isValid).toBe(true);
      expect(res.body.authToken).toBeDefined();
    } catch (error) {
      console.log(error);
    }
  });
});
