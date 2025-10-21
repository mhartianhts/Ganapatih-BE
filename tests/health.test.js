import request from 'supertest';
import app from '../src/app.js';
import { setupDatabase, closeDatabase } from './helpers/testUtils.js';

describe('Health Check Endpoint', () => {
  beforeAll(async () => {
    await setupDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('GET /health', () => {
    it('TC-HEALTH-001: Should return OK status with database time', async () => {
      const response = await request(app)
        .get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('database');
      expect(response.body.database).toBeTruthy();
    });
  });

  describe('GET /docs', () => {
    it('Should redirect to Swagger documentation', async () => {
      const response = await request(app)
        .get('/docs/');

      // Swagger UI redirects
      expect([200, 301, 302]).toContain(response.status);
    });
  });
});

