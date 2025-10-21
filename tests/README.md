# Testing Guide - Ganapatih Backend API

## 📋 Overview

Proyek ini menggunakan **Jest** sebagai testing framework dan **Supertest** untuk HTTP assertion testing. Dokumentasi ini menjelaskan cara setup dan menjalankan automated tests.

## 🛠️ Setup Testing Environment

### 1. Install Dependencies

Dependencies testing sudah terinstall melalui `package.json`:
- `jest` - Testing framework
- `supertest` - HTTP testing library
- `cross-env` - Cross-platform environment variables
- `@babel/preset-env` - Babel preset untuk ES modules

### 2. Konfigurasi Database Testing

Buat file `.env.test` di root directory dengan konfigurasi database terpisah untuk testing:

```env
# Test Environment Configuration
NODE_ENV=test
PORT=3001

# Database Configuration (gunakan database terpisah untuk testing)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ganapatih_test_db
DB_USER=postgres
DB_PASSWORD=postgres

# JWT Configuration
JWT_SECRET=test_jwt_secret_key_for_testing
JWT_REFRESH_SECRET=test_jwt_refresh_secret_key_for_testing
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=*
```

**PENTING**: Gunakan database terpisah untuk testing agar data production tidak terhapus!

### 3. Buat Test Database

```bash
# Buat database untuk testing
createdb ganapatih_test_db

# Atau menggunakan psql
psql -U postgres -c "CREATE DATABASE ganapatih_test_db;"
```

## 🚀 Menjalankan Tests

### Run All Tests

```bash
npm test
```

### Run Tests dengan Watch Mode

Otomatis re-run tests saat ada perubahan file:

```bash
npm run test:watch
```

### Run Tests dengan Coverage Report

```bash
npm run test:coverage
```

Coverage report akan tersimpan di folder `coverage/`.

### Run Specific Test File

```bash
# Auth tests
npm test -- auth

# Posts tests
npm test -- posts

# Follow tests
npm test -- follow

# Users tests
npm test -- users

# Health check tests
npm test -- health
```

### Run Specific Test Suite

```bash
npm test -- --testNamePattern="Authentication"
```

### Run Tests in Verbose Mode

```bash
npm test -- --verbose
```

## 📁 Struktur Test Files

```
tests/
├── auth.test.js          # Test untuk authentication endpoints
├── posts.test.js         # Test untuk posts endpoints
├── follow.test.js        # Test untuk follow/unfollow endpoints
├── users.test.js         # Test untuk user search endpoints
├── health.test.js        # Test untuk health check endpoints
├── setup.js              # Setup file untuk Jest
├── helpers/
│   └── testUtils.js      # Helper functions untuk testing
└── README.md             # Dokumentasi testing (file ini)
```

## 📝 Test Coverage

File-file yang di-cover oleh tests:

- ✅ **Authentication** (`/api/auth/*`)
  - Register user
  - Login user
  - Refresh token

- ✅ **Posts** (`/api/posts`, `/api/feed`)
  - Create post
  - Get feed with pagination

- ✅ **Follow/Unfollow** (`/api/follow/*`)
  - Follow user
  - Unfollow user

- ✅ **User Search** (`/api/users/search`)
  - Search users by username
  - Pagination and limits

- ✅ **Health Check** (`/health`)
  - Database connection status

## 🔧 Helper Functions

File `tests/helpers/testUtils.js` menyediakan utility functions:

### Database Management

```javascript
import { setupDatabase, cleanupDatabase, closeDatabase } from './helpers/testUtils.js';

// Setup database sebelum testing
await setupDatabase();

// Cleanup data setelah setiap test
await cleanupDatabase();

// Close koneksi setelah semua test selesai
await closeDatabase();
```

### Create Test Data

```javascript
import {
  createTestUser,
  createTestPost,
  createTestFollow,
  generateTestToken,
  generateTestRefreshToken,
} from './helpers/testUtils.js';

// Membuat test user
const user = await createTestUser('username', 'password');

// Generate JWT token
const token = generateTestToken(user.id);

// Membuat test post
const post = await createTestPost(user.id, 'Post content');

// Membuat follow relationship
await createTestFollow(followerId, followeeId);
```

## 📊 Test Statistics

| Test Suite | Total Tests | Status |
|------------|-------------|--------|
| Authentication | 10 | ✅ |
| Posts | 9 | ✅ |
| Follow/Unfollow | 11 | ✅ |
| User Search | 8 | ✅ |
| Health Check | 2 | ✅ |
| **TOTAL** | **40** | ✅ |

## 🎯 Best Practices

### 1. Test Isolation

Setiap test harus independen dan tidak bergantung pada test lain:

```javascript
afterEach(async () => {
  await cleanupDatabase(); // Clean data setelah setiap test
});
```

### 2. Use beforeEach for Setup

```javascript
beforeEach(async () => {
  testUser = await createTestUser('testuser', 'password123');
  testToken = generateTestToken(testUser.id);
});
```

### 3. Clear Test Names

Gunakan nama test yang deskriptif:

```javascript
it('TC-AUTH-001: Should register a new user with valid data', async () => {
  // Test code
});
```

### 4. Test Both Success and Error Cases

```javascript
// Success case
it('Should create post with valid data', async () => { ... });

// Error case
it('Should return 400 when content is missing', async () => { ... });
```

### 5. Use Assertions

```javascript
expect(response.status).toBe(200);
expect(response.body).toHaveProperty('token');
expect(response.body.username).toBe('testuser');
```

## 🐛 Troubleshooting

### Database Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solusi**: Pastikan PostgreSQL berjalan dan `.env.test` sudah dikonfigurasi dengan benar.

```bash
# Check PostgreSQL status
sudo service postgresql status

# Restart PostgreSQL
sudo service postgresql restart
```

### Test Database Already Exists

```
Error: database "ganapatih_test_db" already exists
```

**Solusi**: Drop dan recreate database jika perlu:

```bash
dropdb ganapatih_test_db
createdb ganapatih_test_db
```

### ES Module Import Error

```
SyntaxError: Cannot use import statement outside a module
```

**Solusi**: Pastikan `"type": "module"` ada di `package.json` dan menggunakan flag `--experimental-vm-modules` saat menjalankan Jest.

### Tests Timeout

```
Timeout - Async callback was not invoked within the 5000 ms timeout
```

**Solusi**: Increase timeout di `jest.config.js`:

```javascript
testTimeout: 10000, // 10 seconds
```

### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::3001
```

**Solusi**: Kill proses yang menggunakan port atau ubah port di `.env.test`.

## 📚 Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

## 🔄 Continuous Integration

Untuk CI/CD, tambahkan script ini di pipeline:

```yaml
# Example GitHub Actions
- name: Run Tests
  run: |
    npm install
    npm run db:sync -- test
    npm test
  env:
    NODE_ENV: test
    DB_NAME: ganapatih_test_db
```

## 📝 Adding New Tests

Untuk menambahkan test baru:

1. Buat file test baru di folder `tests/`
2. Import dependencies yang diperlukan
3. Gunakan struktur describe/it yang konsisten
4. Setup dan cleanup database dengan proper
5. Gunakan helper functions dari `testUtils.js`
6. Update dokumentasi ini jika perlu

Contoh template:

```javascript
import request from 'supertest';
import app from '../src/app.js';
import { setupDatabase, cleanupDatabase, closeDatabase } from './helpers/testUtils.js';

describe('Your Feature Tests', () => {
  beforeAll(async () => {
    await setupDatabase();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('GET /your/endpoint', () => {
    it('Should do something', async () => {
      const response = await request(app)
        .get('/your/endpoint');

      expect(response.status).toBe(200);
    });
  });
});
```

---

**Happy Testing! 🧪**

