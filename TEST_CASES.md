# Dokumentasi Test Cases - Ganapatih Backend API

## 📋 Overview

Dokumen ini berisi daftar test cases yang telah diuji untuk API Ganapatih. Setiap test case mencakup endpoint yang diuji, metode HTTP, input, expected output, dan status hasil testing.

---

## 🔐 Authentication Tests

### 1. Register User

#### TC-AUTH-001: Register dengan data valid
- **Endpoint**: `POST /api/auth/register`
- **Input**:
  ```json
  {
    "username": "testuser",
    "password": "password123"
  }
  ```
- **Expected Output**: 
  - Status Code: `201`
  - Response Body:
    ```json
    {
      "id": 1,
      "username": "testuser"
    }
    ```
- **Status**: ✅ Passed

#### TC-AUTH-002: Register dengan username yang sudah ada
- **Endpoint**: `POST /api/auth/register`
- **Input**:
  ```json
  {
    "username": "testuser",
    "password": "password123"
  }
  ```
- **Expected Output**: 
  - Status Code: `409`
  - Response Body:
    ```json
    {
      "error": "Username already exists"
    }
    ```
- **Status**: ✅ Passed

#### TC-AUTH-003: Register tanpa username
- **Endpoint**: `POST /api/auth/register`
- **Input**:
  ```json
  {
    "password": "password123"
  }
  ```
- **Expected Output**: 
  - Status Code: `400`
  - Response Body:
    ```json
    {
      "error": "Username and password are required"
    }
    ```
- **Status**: ✅ Passed

#### TC-AUTH-004: Register tanpa password
- **Endpoint**: `POST /api/auth/register`
- **Input**:
  ```json
  {
    "username": "testuser"
  }
  ```
- **Expected Output**: 
  - Status Code: `400`
  - Response Body:
    ```json
    {
      "error": "Username and password are required"
    }
    ```
- **Status**: ✅ Passed

### 2. Login User

#### TC-AUTH-005: Login dengan kredensial valid
- **Endpoint**: `POST /api/auth/login`
- **Input**:
  ```json
  {
    "username": "testuser",
    "password": "password123"
  }
  ```
- **Expected Output**: 
  - Status Code: `200`
  - Response Body:
    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
    }
    ```
- **Status**: ✅ Passed

#### TC-AUTH-006: Login dengan password salah
- **Endpoint**: `POST /api/auth/login`
- **Input**:
  ```json
  {
    "username": "testuser",
    "password": "wrongpassword"
  }
  ```
- **Expected Output**: 
  - Status Code: `401`
  - Response Body:
    ```json
    {
      "error": "Invalid credentials"
    }
    ```
- **Status**: ✅ Passed

#### TC-AUTH-007: Login dengan username tidak terdaftar
- **Endpoint**: `POST /api/auth/login`
- **Input**:
  ```json
  {
    "username": "nonexistent",
    "password": "password123"
  }
  ```
- **Expected Output**: 
  - Status Code: `401`
  - Response Body:
    ```json
    {
      "error": "Invalid credentials"
    }
    ```
- **Status**: ✅ Passed

### 3. Refresh Token

#### TC-AUTH-008: Refresh token dengan token valid
- **Endpoint**: `POST /api/auth/refresh`
- **Input**:
  ```json
  {
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
  ```
- **Expected Output**: 
  - Status Code: `200`
  - Response Body:
    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
    }
    ```
- **Status**: ✅ Passed

#### TC-AUTH-009: Refresh token tanpa token
- **Endpoint**: `POST /api/auth/refresh`
- **Input**:
  ```json
  {}
  ```
- **Expected Output**: 
  - Status Code: `400`
  - Response Body:
    ```json
    {
      "error": "Refresh token is required"
    }
    ```
- **Status**: ✅ Passed

#### TC-AUTH-010: Refresh token dengan token invalid/expired
- **Endpoint**: `POST /api/auth/refresh`
- **Input**:
  ```json
  {
    "refreshToken": "invalid.token.here"
  }
  ```
- **Expected Output**: 
  - Status Code: `401`
  - Response Body:
    ```json
    {
      "error": "Invalid or expired refresh token"
    }
    ```
- **Status**: ✅ Passed

---

## 📝 Posts Tests

### 4. Create Post

#### TC-POST-001: Membuat post dengan data valid
- **Endpoint**: `POST /api/posts`
- **Headers**: `Authorization: Bearer <valid_token>`
- **Input**:
  ```json
  {
    "content": "Ini adalah post pertama saya!"
  }
  ```
- **Expected Output**: 
  - Status Code: `201`
  - Response Body:
    ```json
    {
      "id": 1,
      "userid": 1,
      "content": "Ini adalah post pertama saya!",
      "createdat": "2024-01-01T00:00:00.000Z"
    }
    ```
- **Status**: ✅ Passed

#### TC-POST-002: Membuat post tanpa authentication
- **Endpoint**: `POST /api/posts`
- **Headers**: None
- **Input**:
  ```json
  {
    "content": "Post tanpa auth"
  }
  ```
- **Expected Output**: 
  - Status Code: `401`
  - Response Body:
    ```json
    {
      "error": "Authentication required"
    }
    ```
- **Status**: ✅ Passed

#### TC-POST-003: Membuat post tanpa content
- **Endpoint**: `POST /api/posts`
- **Headers**: `Authorization: Bearer <valid_token>`
- **Input**:
  ```json
  {}
  ```
- **Expected Output**: 
  - Status Code: `400`
  - Response Body:
    ```json
    {
      "error": "Content is required"
    }
    ```
- **Status**: ✅ Passed

#### TC-POST-004: Membuat post dengan content lebih dari 200 karakter
- **Endpoint**: `POST /api/posts`
- **Headers**: `Authorization: Bearer <valid_token>`
- **Input**:
  ```json
  {
    "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit."
  }
  ```
- **Expected Output**: 
  - Status Code: `400`
  - Response Body:
    ```json
    {
      "error": "Content must not exceed 200 characters"
    }
    ```
- **Status**: ✅ Passed

### 5. Get Feed

#### TC-POST-005: Mendapatkan feed dengan authentication valid
- **Endpoint**: `GET /api/feed`
- **Headers**: `Authorization: Bearer <valid_token>`
- **Query Parameters**: None
- **Expected Output**: 
  - Status Code: `200`
  - Response Body:
    ```json
    {
      "page": 1,
      "posts": [
        {
          "id": 1,
          "userid": 2,
          "content": "Post dari user yang difollow",
          "createdat": "2024-01-01T00:00:00.000Z"
        }
      ]
    }
    ```
- **Status**: ✅ Passed

#### TC-POST-006: Mendapatkan feed dengan pagination
- **Endpoint**: `GET /api/feed?page=2&limit=5`
- **Headers**: `Authorization: Bearer <valid_token>`
- **Query Parameters**: 
  - `page`: 2
  - `limit`: 5
- **Expected Output**: 
  - Status Code: `200`
  - Response Body:
    ```json
    {
      "page": 2,
      "posts": [...]
    }
    ```
- **Status**: ✅ Passed

#### TC-POST-007: Mendapatkan feed tanpa authentication
- **Endpoint**: `GET /api/feed`
- **Headers**: None
- **Expected Output**: 
  - Status Code: `401`
  - Response Body:
    ```json
    {
      "error": "Authentication required"
    }
    ```
- **Status**: ✅ Passed

---

## 👥 Follow/Unfollow Tests

### 6. Follow User

#### TC-FOLLOW-001: Follow user dengan ID valid
- **Endpoint**: `POST /api/follow/2`
- **Headers**: `Authorization: Bearer <valid_token>`
- **Expected Output**: 
  - Status Code: `200`
  - Response Body:
    ```json
    {
      "message": "you are now following user 2"
    }
    ```
- **Status**: ✅ Passed

#### TC-FOLLOW-002: Follow user yang sudah difollow
- **Endpoint**: `POST /api/follow/2`
- **Headers**: `Authorization: Bearer <valid_token>`
- **Expected Output**: 
  - Status Code: `400`
  - Response Body:
    ```json
    {
      "error": "Already following this user"
    }
    ```
- **Status**: ✅ Passed

#### TC-FOLLOW-003: Follow diri sendiri
- **Endpoint**: `POST /api/follow/1` (User ID = 1)
- **Headers**: `Authorization: Bearer <valid_token>` (User ID = 1)
- **Expected Output**: 
  - Status Code: `400`
  - Response Body:
    ```json
    {
      "error": "Cannot follow yourself"
    }
    ```
- **Status**: ✅ Passed

#### TC-FOLLOW-004: Follow user yang tidak ada
- **Endpoint**: `POST /api/follow/999`
- **Headers**: `Authorization: Bearer <valid_token>`
- **Expected Output**: 
  - Status Code: `404`
  - Response Body:
    ```json
    {
      "error": "User not found"
    }
    ```
- **Status**: ✅ Passed

#### TC-FOLLOW-005: Follow tanpa authentication
- **Endpoint**: `POST /api/follow/2`
- **Headers**: None
- **Expected Output**: 
  - Status Code: `401`
  - Response Body:
    ```json
    {
      "error": "Authentication required"
    }
    ```
- **Status**: ✅ Passed

### 7. Unfollow User

#### TC-FOLLOW-006: Unfollow user yang sedang difollow
- **Endpoint**: `DELETE /api/follow/2`
- **Headers**: `Authorization: Bearer <valid_token>`
- **Expected Output**: 
  - Status Code: `200`
  - Response Body:
    ```json
    {
      "message": "you unfollowed user 2"
    }
    ```
- **Status**: ✅ Passed

#### TC-FOLLOW-007: Unfollow user yang tidak difollow
- **Endpoint**: `DELETE /api/follow/3`
- **Headers**: `Authorization: Bearer <valid_token>`
- **Expected Output**: 
  - Status Code: `400`
  - Response Body:
    ```json
    {
      "error": "Not following this user"
    }
    ```
- **Status**: ✅ Passed

#### TC-FOLLOW-008: Unfollow tanpa authentication
- **Endpoint**: `DELETE /api/follow/2`
- **Headers**: None
- **Expected Output**: 
  - Status Code: `401`
  - Response Body:
    ```json
    {
      "error": "Authentication required"
    }
    ```
- **Status**: ✅ Passed

---

## 🔍 User Search Tests

### 8. Search Users

#### TC-USER-001: Search user dengan keyword valid
- **Endpoint**: `GET /api/users/search?q=test`
- **Query Parameters**: 
  - `q`: "test"
- **Expected Output**: 
  - Status Code: `200`
  - Response Body:
    ```json
    {
      "users": [
        {
          "id": 1,
          "username": "testuser"
        },
        {
          "id": 3,
          "username": "testuser2"
        }
      ]
    }
    ```
- **Status**: ✅ Passed

#### TC-USER-002: Search user dengan limit
- **Endpoint**: `GET /api/users/search?q=user&limit=5`
- **Query Parameters**: 
  - `q`: "user"
  - `limit`: 5
- **Expected Output**: 
  - Status Code: `200`
  - Response Body:
    ```json
    {
      "users": [...]
    }
    ```
  - Jumlah users maksimal 5
- **Status**: ✅ Passed

#### TC-USER-003: Search tanpa keyword
- **Endpoint**: `GET /api/users/search`
- **Expected Output**: 
  - Status Code: `200`
  - Response Body:
    ```json
    {
      "users": []
    }
    ```
- **Status**: ✅ Passed

#### TC-USER-004: Search user yang tidak ada
- **Endpoint**: `GET /api/users/search?q=nonexistentuser12345`
- **Query Parameters**: 
  - `q`: "nonexistentuser12345"
- **Expected Output**: 
  - Status Code: `200`
  - Response Body:
    ```json
    {
      "users": []
    }
    ```
- **Status**: ✅ Passed

---

## 🏥 Health Check Tests

### 9. Health Check

#### TC-HEALTH-001: Health check endpoint
- **Endpoint**: `GET /health`
- **Expected Output**: 
  - Status Code: `200`
  - Response Body:
    ```json
    {
      "status": "ok",
      "database": "2024-01-01T00:00:00.000Z"
    }
    ```
- **Status**: ✅ Passed

#### TC-HEALTH-002: Health check saat database offline
- **Endpoint**: `GET /health`
- **Expected Output**: 
  - Status Code: `500`
  - Response Body:
    ```json
    {
      "status": "error",
      "message": "Database connection failed"
    }
    ```
- **Status**: ✅ Passed

---

## 📊 Test Summary

| Category | Total Tests | Passed | Failed | Pending |
|----------|-------------|--------|--------|---------|
| Authentication | 10 | 10 | 0 | 0 |
| Posts | 7 | 7 | 0 | 0 |
| Follow/Unfollow | 8 | 8 | 0 | 0 |
| User Search | 4 | 4 | 0 | 0 |
| Health Check | 2 | 2 | 0 | 0 |
| **TOTAL** | **31** | **31** | **0** | **0** |

---

## 🔄 Test Environment

- **Server**: Node.js v18+
- **Database**: PostgreSQL 14+
- **Testing Tool**: Manual testing via Postman/Thunder Client + Automated tests via Jest
- **Test Date**: October 2024
- **Tested By**: Development Team

---

## 📝 Notes

### Test Data Setup
Sebelum menjalankan test, pastikan:
1. Database sudah di-setup dengan `npm run db:sync`
2. Environment variables sudah dikonfigurasi dengan benar
3. Server berjalan di `http://localhost:3000`

### Known Issues
- None

### Future Test Cases
- [ ] Test untuk upload gambar di post (jika akan diimplementasi)
- [ ] Test untuk like/unlike post
- [ ] Test untuk comment pada post
- [ ] Test untuk update profile user
- [ ] Load testing untuk performa
- [ ] Security testing untuk SQL injection dan XSS

---

## 🚀 Running Tests

### Manual Testing
Gunakan Postman atau Thunder Client dengan collection yang tersedia di folder `tests/postman`.

### Automated Testing
```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run tests dengan coverage
npm run test:coverage

# Run tests untuk endpoint tertentu
npm test -- auth
npm test -- posts
npm test -- follow
npm test -- users
```

---

**Last Updated**: October 21, 2024

