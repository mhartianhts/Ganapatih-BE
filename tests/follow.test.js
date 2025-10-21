import request from 'supertest';
import app from '../src/app.js';
import {
  setupDatabase,
  cleanupDatabase,
  closeDatabase,
  createTestUser,
  createTestFollow,
  generateTestToken,
} from './helpers/testUtils.js';

describe('Follow Endpoints', () => {
  let testUser1;
  let testUser2;
  let testUser3;
  let token1;
  let token2;

  beforeAll(async () => {
    await setupDatabase();
  });

  beforeEach(async () => {
    // Create test users
    testUser1 = await createTestUser('user1', 'password123');
    testUser2 = await createTestUser('user2', 'password123');
    testUser3 = await createTestUser('user3', 'password123');
    
    token1 = generateTestToken(testUser1.id);
    token2 = generateTestToken(testUser2.id);
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('POST /api/follow/:userid', () => {
    it('TC-FOLLOW-001: Should follow user with valid ID', async () => {
      const response = await request(app)
        .post(`/api/follow/${testUser2.id}`)
        .set('Authorization', `Bearer ${token1}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain(`following user ${testUser2.id}`);
    });

    it('TC-FOLLOW-002: Should return 200 when already following user (idempotent)', async () => {
      // Follow user first
      await createTestFollow(testUser1.id, testUser2.id);

      // Try to follow again (idempotent operation)
      const response = await request(app)
        .post(`/api/follow/${testUser2.id}`)
        .set('Authorization', `Bearer ${token1}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });

    it('TC-FOLLOW-003: Should return 400 when trying to follow self', async () => {
      const response = await request(app)
        .post(`/api/follow/${testUser1.id}`)
        .set('Authorization', `Bearer ${token1}`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('TC-FOLLOW-004: Should return 404 when user does not exist', async () => {
      const response = await request(app)
        .post('/api/follow/999')
        .set('Authorization', `Bearer ${token1}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    it('TC-FOLLOW-005: Should return 401 without authentication', async () => {
      const response = await request(app)
        .post(`/api/follow/${testUser2.id}`);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('Should allow user to follow multiple users', async () => {
      // Follow user2
      const response1 = await request(app)
        .post(`/api/follow/${testUser2.id}`)
        .set('Authorization', `Bearer ${token1}`);

      expect(response1.status).toBe(200);

      // Follow user3
      const response2 = await request(app)
        .post(`/api/follow/${testUser3.id}`)
        .set('Authorization', `Bearer ${token1}`);

      expect(response2.status).toBe(200);
    });
  });

  describe('DELETE /api/follow/:userid', () => {
    beforeEach(async () => {
      // Create follow relationship before each unfollow test
      await createTestFollow(testUser1.id, testUser2.id);
    });

    it('TC-FOLLOW-006: Should unfollow user that is being followed', async () => {
      const response = await request(app)
        .delete(`/api/follow/${testUser2.id}`)
        .set('Authorization', `Bearer ${token1}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain(`unfollowed user ${testUser2.id}`);
    });

    it('TC-FOLLOW-007: Should return 200 when not following user (idempotent)', async () => {
      const response = await request(app)
        .delete(`/api/follow/${testUser3.id}`)
        .set('Authorization', `Bearer ${token1}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });

    it('TC-FOLLOW-008: Should return 401 without authentication', async () => {
      const response = await request(app)
        .delete(`/api/follow/${testUser2.id}`);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('Should be able to follow again after unfollowing', async () => {
      // Unfollow
      const unfollowResponse = await request(app)
        .delete(`/api/follow/${testUser2.id}`)
        .set('Authorization', `Bearer ${token1}`);

      expect(unfollowResponse.status).toBe(200);

      // Follow again
      const followResponse = await request(app)
        .post(`/api/follow/${testUser2.id}`)
        .set('Authorization', `Bearer ${token1}`);

      expect(followResponse.status).toBe(200);
    });
  });

  describe('Follow Relationships', () => {
    it('Should allow mutual following', async () => {
      // User1 follows User2
      const response1 = await request(app)
        .post(`/api/follow/${testUser2.id}`)
        .set('Authorization', `Bearer ${token1}`);

      expect(response1.status).toBe(200);

      // User2 follows User1
      const response2 = await request(app)
        .post(`/api/follow/${testUser1.id}`)
        .set('Authorization', `Bearer ${token2}`);

      expect(response2.status).toBe(200);
    });
  });
});

