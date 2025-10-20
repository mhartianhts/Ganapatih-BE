# Ganapatih Backend API

Backend API untuk aplikasi Ganapatih - Platform media sosial sederhana yang dibangun dengan Node.js, Express, dan PostgreSQL.

## 📋 Deskripsi

Ganapatih adalah aplikasi backend REST API yang menyediakan fitur-fitur dasar media sosial seperti autentikasi pengguna, membuat postingan, follow/unfollow pengguna, dan melihat feed dari pengguna yang diikuti.

## ✨ Fitur

- 🔐 **Autentikasi**
  - Register pengguna baru
  - Login dengan username dan password
  - Refresh token untuk keamanan session
  - JWT-based authentication

- 📝 **Postingan**
  - Membuat postingan (maksimal 200 karakter)
  - Melihat feed dari pengguna yang diikuti
  - Pagination untuk feed

- 👥 **Interaksi Sosial**
  - Follow pengguna lain
  - Unfollow pengguna
  - Pencarian pengguna berdasarkan username

- 📚 **Dokumentasi API**
  - Swagger UI untuk dokumentasi interaktif
  - Health check endpoint

## 🛠️ Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express 5.x
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **API Documentation**: Swagger (swagger-jsdoc & swagger-ui-express)
- **CORS**: Enabled dengan konfigurasi custom

## 📦 Instalasi

### Prasyarat

- Node.js (versi 14 atau lebih tinggi)
- PostgreSQL (versi 12 atau lebih tinggi)
- npm atau yarn

### Langkah-langkah Instalasi

1. Clone repository ini:
```bash
git clone <repository-url>
cd Ganapatih-BE
```

2. Install dependencies:
```bash
npm install
```

3. Buat file `.env` di root directory dan konfigurasi environment variables:
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ganapatih_db
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# CORS Configuration (comma-separated origins)
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

4. Buat database PostgreSQL:
```bash
createdb ganapatih_db
```

5. Sinkronisasi database (membuat tabel):
```bash
npm run db:sync
```

## 🚀 Menjalankan Aplikasi

### Development Mode

Menjalankan aplikasi dengan nodemon (auto-reload):
```bash
npm run dev
```

### Production Mode

Menjalankan aplikasi tanpa auto-reload:
```bash
npm start
```

Server akan berjalan di `http://localhost:3000` (atau port yang Anda tentukan di `.env`).

## 📖 Dokumentasi API

Setelah server berjalan, Anda dapat mengakses:

- **Swagger UI**: `http://localhost:3000/docs`
- **Health Check**: `http://localhost:3000/health`

## 🔌 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Deskripsi | Auth Required |
|--------|----------|-----------|---------------|
| POST | `/api/auth/register` | Register pengguna baru | ❌ |
| POST | `/api/auth/login` | Login pengguna | ❌ |
| POST | `/api/auth/refresh` | Refresh access token | ❌ |

### Posts (`/api/posts`, `/api/feed`)

| Method | Endpoint | Deskripsi | Auth Required |
|--------|----------|-----------|---------------|
| POST | `/api/posts` | Membuat postingan baru | ✅ |
| GET | `/api/feed` | Mendapatkan feed (dengan pagination) | ✅ |

### Follow (`/api/follow`)

| Method | Endpoint | Deskripsi | Auth Required |
|--------|----------|-----------|---------------|
| POST | `/api/follow/:userid` | Follow pengguna | ✅ |
| DELETE | `/api/follow/:userid` | Unfollow pengguna | ✅ |

### Users (`/api/users`)

| Method | Endpoint | Deskripsi | Auth Required |
|--------|----------|-----------|---------------|
| GET | `/api/users/search` | Cari pengguna berdasarkan username | ❌ |

## 🗄️ Database Management

### Sinkronisasi Database

**Safe Mode (Recommended untuk Production)**:
```bash
npm run db:sync
```
Membuat tabel baru tanpa mengubah tabel yang sudah ada.

**Alter Mode (Development)**:
```bash
npm run db:sync:alter
```
Update struktur tabel sesuai dengan model (tidak menghapus data).

**Force Mode (⚠️ DANGER)**:
```bash
npm run db:sync:force
```
Drop semua tabel dan membuat ulang. **Akan menghapus semua data!**

## 📁 Struktur Project

```
Ganapatih-BE/
├── src/
│   ├── config/
│   │   └── databaseConfig.js      # Konfigurasi koneksi database
│   ├── controllers/               # Request handlers
│   │   ├── authController.js
│   │   ├── followController.js
│   │   ├── postController.js
│   │   └── userController.js
│   ├── database/
│   │   ├── migrations/            # Database migrations
│   │   ├── seeders/               # Database seeders
│   │   └── sync.js                # Database sync utility
│   ├── middlewares/
│   │   ├── authMiddleware.js      # JWT authentication middleware
│   │   └── errorHandler.js        # Global error handler
│   ├── models/                    # Sequelize models
│   │   ├── followModel.js
│   │   ├── postModel.js
│   │   ├── tokenModel.js
│   │   └── userModel.js
│   ├── routes/                    # API routes
│   │   ├── authRoutes.js
│   │   ├── followRoutes.js
│   │   ├── postRoutes.js
│   │   └── userRoutes.js
│   ├── services/                  # Business logic
│   │   ├── authService.js
│   │   ├── followService.js
│   │   ├── postService.js
│   │   └── userService.js
│   ├── utils/
│   │   └── swagger.js             # Swagger configuration
│   ├── app.js                     # Express app configuration
│   └── server.js                  # Server entry point
├── .env                           # Environment variables (buat sendiri)
├── package.json
└── README.md
```

## 🔐 Autentikasi

API menggunakan JWT (JSON Web Token) untuk autentikasi. Untuk mengakses endpoint yang memerlukan autentikasi:

1. Login atau register untuk mendapatkan access token
2. Sertakan token di header request:
```
Authorization: Bearer <your_access_token>
```

### Token Expiry

- **Access Token**: 1 jam (default)
- **Refresh Token**: 7 hari (default)

Gunakan endpoint `/api/auth/refresh` dengan refresh token untuk mendapatkan access token baru tanpa perlu login ulang.

## 🧪 Testing

```bash
npm test
```

*Note: Test belum dikonfigurasi. Akan ditambahkan di versi mendatang.*

## 📝 Environment Variables

| Variable | Deskripsi | Default | Required |
|----------|-----------|---------|----------|
| `PORT` | Port server | 3000 | ❌ |
| `NODE_ENV` | Environment mode | development | ❌ |
| `DB_HOST` | PostgreSQL host | localhost | ✅ |
| `DB_PORT` | PostgreSQL port | 5432 | ✅ |
| `DB_NAME` | Nama database | - | ✅ |
| `DB_USER` | Username database | - | ✅ |
| `DB_PASSWORD` | Password database | - | ✅ |
| `JWT_SECRET` | Secret key untuk JWT | - | ✅ |
| `JWT_REFRESH_SECRET` | Secret key untuk refresh token | - | ✅ |
| `JWT_EXPIRES_IN` | Durasi access token | 1h | ❌ |
| `JWT_REFRESH_EXPIRES_IN` | Durasi refresh token | 7d | ❌ |
| `CORS_ORIGIN` | Allowed origins (comma-separated) | * | ❌ |

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan buat pull request atau buka issue untuk saran dan perbaikan.

## 👤 Author

**mhartian**

## 📄 License

ISC License

---

## 📚 Referensi

- [Express.js Documentation](https://expressjs.com/)
- [Sequelize Documentation](https://sequelize.org/)
- [JWT.io](https://jwt.io/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 🐛 Troubleshooting

### Database Connection Error

Pastikan PostgreSQL sudah berjalan dan kredensial di `.env` sudah benar:
```bash
# Check PostgreSQL status
sudo service postgresql status

# Restart PostgreSQL
sudo service postgresql restart
```

### Port Already in Use

Ubah port di file `.env` atau stop aplikasi yang menggunakan port tersebut:
```bash
# Cari aplikasi yang menggunakan port 3000
netstat -ano | findstr :3000

# Kill process (Windows)
taskkill /PID <PID> /F
```

### JWT Token Invalid

Token expired atau invalid. Gunakan endpoint `/api/auth/refresh` atau login ulang.

---

**Happy Coding! 🚀**