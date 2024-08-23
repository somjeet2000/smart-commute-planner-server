const dotenv = require('dotenv');
dotenv.config();
const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const Users = require('../models/Users');

// Before running tests, connect to your test database
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL);
});

// After running tests, delete the users and disconnect from the test database
afterAll(async () => {
  await Users.deleteMany({});
  await mongoose.connection.close();
});

describe('Auth API Tests', () => {
  // Test Registration Route
  describe('POST /api/v1/auth/create_user', () => {
    test('should create a new user with valid details', async () => {
      const res = await request(app).post('/api/v1/auth/create_user').send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });
      expect(res.statusCode).toBe(200);
      expect(res.body.isValid).toBe(true);
      expect(res.body.authToken).toBeDefined();
    });

    test('should return an error if the email already exists', async () => {
      await Users.create({
        name: 'Test User',
        email: 'duplicate@example.com',
        password: 'password123',
      });
      const res = await request(app).post('/api/v1/auth/create_user').send({
        name: 'Test User',
        email: 'duplicate@example.com',
        password: 'password123',
      });
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe(
        'User with this email already exists. Please enter an unique email'
      );
    });
  });

  // Test Login Route
  describe('POST /api/v1/auth/login_user', () => {
    test('should login a user with valid credentials', async () => {
      const res = await request(app).post('/api/v1/auth/login_user').send({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(res.statusCode).toBe(200);
      expect(res.body.isValid).toBe(true);
      expect(res.body.authToken).toBeDefined();
    });

    test('should return an error with invalid credentials', async () => {
      const res = await request(app).post('/api/v1/auth/login_user').send({
        email: 'test@example.com',
        password: 'wrongpassword',
      });
      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe('Invalid Credentials');
    });
  });

  // Test Get Current User Route
  describe('GET /api/v1/auth/get_current_user', () => {
    test('should return current user details with valid token', async () => {
      const loginRes = await request(app).post('/api/v1/auth/login_user').send({
        email: 'test@example.com',
        password: 'password123',
      });
      const token = loginRes.body.authToken;
      const res = await request(app)
        .get('/api/v1/auth/get_current_user')
        .set('auth-token', token);
      expect(res.statusCode).toBe(200);
      expect(res.body.email).toBe('test@example.com');
      expect(res.body.password).toBeUndefined(); // Password should be excluded
    });

    test('should return an error if the token is not provided', async () => {
      const res = await request(app).get('/api/v1/auth/get_current_user');
      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe('Invalid Token');
    });
  });
});
