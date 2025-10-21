import request from 'supertest';
import app from '../src/app.js';
import {
  setupDatabase,
  cleanupDatabase,
  closeDatabase,
  createTestUser,
  generateTestRefreshToken,
} from './helpers/testUtils.js';

describe('Authentication Endpoints', () => {
  beforeAll(async () => {
    await setupDatabase();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('POST /api/auth/register', () => {
    it('TC-AUTH-001: Should register a new user with valid data', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          password: 'password123',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('username', 'testuser');
      expect(response.body).not.toHaveProperty('password');
    });

    it('TC-AUTH-002: Should return 409 when username already exists', async () => {
      // Create user first
      await createTestUser('testuser', 'password123');

      // Try to register with same username
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          password: 'password123',
        });

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('error');
    });

    it('TC-AUTH-003: Should return 400 when username is missing', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          password: 'password123',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('TC-AUTH-004: Should return 400 when password is missing', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
        });

      expect(response.status).toBe(422);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user before each login test
      await createTestUser('testuser', 'password123');
    });

    it('TC-AUTH-005: Should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('refreshToken');
      expect(typeof response.body.token).toBe('string');
      expect(typeof response.body.refreshToken).toBe('string');
    });

    it('TC-AUTH-006: Should return 401 with wrong password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('TC-AUTH-007: Should return 401 with non-existent username', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'nonexistent',
          password: 'password123',
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('TC-AUTH-008: Should refresh token with valid refresh token', async () => {
      // Create user and generate refresh token
      const user = await createTestUser('testuser', 'password123');
      const refreshToken = generateTestRefreshToken(user.id);
      
      // Calculate expires_at (7 days from now)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);
      
      // Save refresh token to database
      const { RefreshToken } = await import('../src/models/tokenModel.js');
      await RefreshToken.create({
        user_id: user.id,
        token: refreshToken,
        expires_at: expiresAt,
      });

      const response = await request(app)
        .post('/api/auth/refresh')
        .send({
          refreshToken,
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('refreshToken');
    });

    it('TC-AUTH-009: Should return 400 when refresh token is missing', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('TC-AUTH-010: Should return 401 with invalid refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({
          refreshToken: 'invalid.token.here',
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });
});

