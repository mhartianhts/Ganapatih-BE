# 🧪 Quick Start - Testing Setup

Panduan cepat untuk setup dan menjalankan tests pada project Ganapatih Backend API.

## ⚡ Quick Setup (5 Menit)

### 1. Install Dependencies

Dependencies testing sudah terinstall otomatis saat `npm install`. Jika belum:

```bash
npm install
```

### 2. Buat Test Database

```bash
# Menggunakan command line
createdb ganapatih_test_db

# Atau menggunakan psql
psql -U postgres -c "CREATE DATABASE ganapatih_test_db;"
```

### 3. Setup Environment Variables

Copy file `env.test.example` menjadi `.env.test`:

```bash
# Linux/Mac
cp env.test.example .env.test

# Windows (PowerShell)
Copy-Item env.test.example .env.test

# Windows (CMD)
copy env.test.example .env.test
```

Edit `.env.test` jika perlu menyesuaikan konfigurasi database Anda.

### 4. Run Tests! 🚀

```bash
npm test
```

## 📝 File-file Penting

| File | Deskripsi |
|------|-----------|
| `TEST_CASES.md` | Dokumentasi lengkap semua test cases (manual testing) |
| `tests/README.md` | Panduan lengkap automated testing |
| `tests/*.test.js` | File-file automated tests |
| `env.test.example` | Template untuk `.env.test` |
| `jest.config.js` | Konfigurasi Jest |

## 🎯 Command Testing

```bash
# Run semua tests
npm test

# Run dengan watch mode (auto re-run saat ada perubahan)
npm run test:watch

# Run dengan coverage report
npm run test:coverage

# Run test untuk endpoint tertentu
npm test -- auth      # Authentication tests
npm test -- posts     # Posts tests
npm test -- follow    # Follow/Unfollow tests
npm test -- users     # User search tests
npm test -- health    # Health check tests
```

## 📊 Test Coverage

Project ini memiliki **40+ automated tests** yang mencakup:

- ✅ **10 tests** untuk Authentication
- ✅ **9 tests** untuk Posts & Feed
- ✅ **11 tests** untuk Follow/Unfollow
- ✅ **8 tests** untuk User Search
- ✅ **2 tests** untuk Health Check

## 🐛 Troubleshooting

### Error: Database Connection Failed

**Masalah**: PostgreSQL tidak running atau konfigurasi salah

**Solusi**:
```bash
# Check status PostgreSQL
sudo service postgresql status

# Start PostgreSQL
sudo service postgresql start

# Atau restart
sudo service postgresql restart
```

### Error: Database "ganapatih_test_db" does not exist

**Masalah**: Test database belum dibuat

**Solusi**:
```bash
createdb ganapatih_test_db
```

### Error: Port Already in Use

**Masalah**: Port 3001 sudah digunakan aplikasi lain

**Solusi**: Ubah `PORT` di `.env.test` ke port lain (misalnya 3002)

### Error: Cannot find module

**Masalah**: Dependencies belum terinstall

**Solusi**:
```bash
npm install
```

## 📚 Dokumentasi Lengkap

Untuk dokumentasi lebih detail, lihat:

1. **[TEST_CASES.md](TEST_CASES.md)** - Dokumentasi manual test cases
2. **[tests/README.md](tests/README.md)** - Panduan lengkap automated testing
3. **[README.md](README.md)** - Dokumentasi utama project

## ✅ Checklist Setup

- [ ] Dependencies terinstall (`npm install`)
- [ ] PostgreSQL running
- [ ] Test database dibuat (`ganapatih_test_db`)
- [ ] File `.env.test` sudah ada dan dikonfigurasi
- [ ] Tests berjalan dengan sukses (`npm test`)

## 🎉 Selesai!

Jika semua tests passed (✓), setup Anda sudah benar dan siap untuk development!

```
PASS  tests/auth.test.js
PASS  tests/posts.test.js
PASS  tests/follow.test.js
PASS  tests/users.test.js
PASS  tests/health.test.js

Test Suites: 5 passed, 5 total
Tests:       40 passed, 40 total
```

---

**Need Help?** Lihat dokumentasi lengkap di [tests/README.md](tests/README.md)

