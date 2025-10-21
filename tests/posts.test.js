import request from 'supertest';
import app from '../src/app.js';
import {
  setupDatabase,
  cleanupDatabase,
  closeDatabase,
  createTestUser,
  createTestPost,
  createTestFollow,
  generateTestToken,
} from './helpers/testUtils.js';

describe('Posts Endpoints', () => {
  let testUser;
  let testToken;

  beforeAll(async () => {
    await setupDatabase();
  });

  beforeEach(async () => {
    // Create test user and token before each test
    testUser = await createTestUser('testuser', 'password123');
    testToken = generateTestToken(testUser.id);
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('POST /api/posts', () => {
    it('TC-POST-001: Should create a post with valid data', async () => {
      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          content: 'Ini adalah post pertama saya!',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('userid', testUser.id);
      expect(response.body).toHaveProperty('content', 'Ini adalah post pertama saya!');
      expect(response.body).toHaveProperty('createdat');
    });

    it('TC-POST-002: Should return 401 without authentication', async () => {
      const response = await request(app)
        .post('/api/posts')
        .send({
          content: 'Post tanpa auth',
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('TC-POST-003: Should return 400 when content is missing', async () => {
      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${testToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('TC-POST-004: Should return 422 when content exceeds 200 characters', async () => {
      const longContent = 'a'.repeat(201);
      
      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          content: longContent,
        });

      expect(response.status).toBe(422);
      expect(response.body).toHaveProperty('error');
    });

    it('Should accept content with exactly 200 characters', async () => {
      const maxContent = 'a'.repeat(200);
      
      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          content: maxContent,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('content', maxContent);
    });
  });

  describe('GET /api/feed', () => {
    let followedUser;

    beforeEach(async () => {
      // Create another user that testUser will follow
      followedUser = await createTestUser('followeduser', 'password123');
      
      // Create follow relationship
      await createTestFollow(testUser.id, followedUser.id);
      
      // Create posts from followed user
      await createTestPost(followedUser.id, 'Post from followed user 1');
      await createTestPost(followedUser.id, 'Post from followed user 2');
    });

    it('TC-POST-005: Should get feed with authentication', async () => {
      const response = await request(app)
        .get('/api/feed')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('posts');
      expect(Array.isArray(response.body.posts)).toBe(true);
      expect(response.body.posts.length).toBeGreaterThan(0);
      
      // Check if posts are from followed user
      response.body.posts.forEach(post => {
        expect(post).toHaveProperty('id');
        expect(post).toHaveProperty('userid');
        expect(post).toHaveProperty('content');
        expect(post).toHaveProperty('createdat');
      });
    });

    it('TC-POST-006: Should get feed with pagination', async () => {
      // Create more posts
      for (let i = 0; i < 15; i++) {
        await createTestPost(followedUser.id, `Post ${i + 1}`);
      }

      const response = await request(app)
        .get('/api/feed?page=2&limit=5')
        .set('Authorization', `Bearer ${testToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('page', 2);
      expect(response.body).toHaveProperty('posts');
      expect(response.body.posts.length).toBeLessThanOrEqual(5);
    });

    it('TC-POST-007: Should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/api/feed');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('Should return empty feed when not following anyone', async () => {
      // Create a new user who doesn't follow anyone
      const newUser = await createTestUser('newuser', 'password123');
      const newToken = generateTestToken(newUser.id);

      const response = await request(app)
        .get('/api/feed')
        .set('Authorization', `Bearer ${newToken}`);

      expect(response.status).toBe(200);
      expect(response.body.posts).toHaveLength(0);
    });
  });
});

