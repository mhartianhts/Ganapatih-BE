import request from 'supertest';
import app from '../src/app.js';
import {
  setupDatabase,
  cleanupDatabase,
  closeDatabase,
  createTestUser,
} from './helpers/testUtils.js';

describe('Users Endpoints', () => {
  beforeAll(async () => {
    await setupDatabase();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('GET /api/users/search', () => {
    beforeEach(async () => {
      // Create multiple test users
      await createTestUser('testuser1', 'password123');
      await createTestUser('testuser2', 'password123');
      await createTestUser('john_doe', 'password123');
      await createTestUser('jane_smith', 'password123');
      await createTestUser('admin', 'password123');
    });

    it('TC-USER-001: Should search users with valid keyword', async () => {
      const response = await request(app)
        .get('/api/users/search?q=test');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('users');
      expect(Array.isArray(response.body.users)).toBe(true);
      expect(response.body.users.length).toBeGreaterThan(0);
      
      // Check if all returned users contain 'test' in username
      response.body.users.forEach(user => {
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('username');
        expect(user.username.toLowerCase()).toContain('test');
      });
    });

    it('TC-USER-002: Should search users with limit', async () => {
      const response = await request(app)
        .get('/api/users/search?q=test&limit=1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('users');
      expect(response.body.users.length).toBeLessThanOrEqual(1);
    });

    it('TC-USER-003: Should return empty array when no keyword provided', async () => {
      const response = await request(app)
        .get('/api/users/search');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('users');
      expect(Array.isArray(response.body.users)).toBe(true);
    });

    it('TC-USER-004: Should return empty array when user not found', async () => {
      const response = await request(app)
        .get('/api/users/search?q=nonexistentuser12345');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('users');
      expect(response.body.users).toHaveLength(0);
    });

    it('Should search be case-insensitive', async () => {
      const response = await request(app)
        .get('/api/users/search?q=TEST');

      expect(response.status).toBe(200);
      expect(response.body.users.length).toBeGreaterThan(0);
    });

    it('Should search partial username', async () => {
      const response = await request(app)
        .get('/api/users/search?q=john');

      expect(response.status).toBe(200);
      expect(response.body.users.length).toBeGreaterThan(0);
      expect(response.body.users[0].username).toContain('john');
    });

    it('Should respect maximum limit of 50', async () => {
      // Create many users
      for (let i = 1; i <= 60; i++) {
        await createTestUser(`user${i}`, 'password123');
      }

      const response = await request(app)
        .get('/api/users/search?q=user&limit=100');

      expect(response.status).toBe(200);
      expect(response.body.users.length).toBeLessThanOrEqual(50);
    });

    it('Should not return password in response', async () => {
      const response = await request(app)
        .get('/api/users/search?q=test');

      expect(response.status).toBe(200);
      response.body.users.forEach(user => {
        expect(user).not.toHaveProperty('password');
      });
    });
  });
});

