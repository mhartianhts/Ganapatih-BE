# 🚀 Quick Start - Menjalankan Tests

## ⚠️ Error Yang Anda Alami

Error `password gagal diotentikasi untuk pengguna postgres` artinya password PostgreSQL di file `.env.test` tidak sesuai dengan setup PostgreSQL Anda.

## 📝 Langkah-Langkah Setup Testing

### 1. Edit File `.env.test`

Buka file `.env.test` dan sesuaikan dengan kredensial PostgreSQL Anda:

```env
# Test Environment Configuration
NODE_ENV=test
PORT=3001

# Database Configuration - SESUAIKAN DENGAN SETUP ANDA!
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ganapatih_test_db
DB_USER=postgres                    # <-- Sesuaikan username PostgreSQL Anda
DB_PASSWORD=password_anda_disini    # <-- Sesuaikan password PostgreSQL Anda

# JWT Configuration
JWT_SECRET=test_jwt_secret_key_for_testing
JWT_REFRESH_SECRET=test_jwt_refresh_secret_key_for_testing
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=*
```

### 2. Buat Database Test

Buka terminal atau psql dan jalankan:

```sql
CREATE DATABASE ganapatih_test_db;
```

Atau menggunakan command line:

```bash
# Windows PowerShell dengan psql
psql -U postgres -c "CREATE DATABASE ganapatih_test_db;"

# Atau login ke psql dan create manual
psql -U postgres
# Kemudian dalam psql:
CREATE DATABASE ganapatih_test_db;
\q
```

### 3. Verifikasi Koneksi Database

Test koneksi database dengan kredensial yang Anda gunakan:

```bash
psql -U postgres -d ganapatih_test_db
```

Jika berhasil login, berarti kredensial sudah benar. Keluar dengan `\q`.

### 4. Run Tests! 🎉

Setelah database dan `.env.test` dikonfigurasi dengan benar:

```bash
# Run all tests
npm test

# Run specific test file
npm test -- auth
npm test -- posts
npm test -- follow
npm test -- users
npm test -- health

# Run dengan coverage
npm run test:coverage
```

## ✅ Jika Tests Berhasil

Anda akan melihat output seperti ini:

```
PASS  tests/auth.test.js
PASS  tests/posts.test.js
PASS  tests/follow.test.js
PASS  tests/users.test.js
PASS  tests/health.test.js

Test Suites: 5 passed, 5 total
Tests:       40 passed, 40 total
Snapshots:   0 total
Time:        4.5s
```

## 🐛 Troubleshooting

### Error: Password Authentication Failed

**Masalah**: Password PostgreSQL di `.env.test` salah

**Solusi**: 
1. Cek password PostgreSQL Anda
2. Update `DB_PASSWORD` di `.env.test`
3. Jika tidak tahu password, reset password PostgreSQL:
   ```bash
   # Windows: Edit pg_hba.conf dan ubah method ke 'trust', restart PostgreSQL
   # Kemudian set password baru:
   psql -U postgres -c "ALTER USER postgres PASSWORD 'password_baru';"
   ```

### Error: Database Does Not Exist

**Masalah**: Database `ganapatih_test_db` belum dibuat

**Solusi**:
```bash
psql -U postgres -c "CREATE DATABASE ganapatih_test_db;"
```

### Error: Connection Refused

**Masalah**: PostgreSQL tidak running

**Solusi**:
```bash
# Cek status
pg_ctl status

# Start PostgreSQL
pg_ctl start

# Atau menggunakan services (Windows)
# Services > PostgreSQL > Start
```

### Error: Role "postgres" Does Not Exist

**Masalah**: User `postgres` tidak ada

**Solusi**: Ubah `DB_USER` di `.env.test` sesuai user PostgreSQL Anda

## 📋 Checklist

Sebelum run tests, pastikan:

- [x] PostgreSQL sudah terinstall dan running
- [x] File `.env.test` sudah dibuat dan dikonfigurasi
- [x] Database `ganapatih_test_db` sudah dibuat
- [x] Kredensial database (user & password) sudah benar
- [x] Dependencies sudah terinstall (`npm install`)

## 📚 File-File Testing Yang Sudah Dibuat

### Dokumentasi:
- `TEST_CASES.md` - Dokumentasi manual test cases (31 test cases)
- `tests/README.md` - Panduan lengkap automated testing
- `TESTING_SETUP.md` - Setup guide
- `SUMMARY_TESTING.md` - Summary lengkap
- `QUICK_START_TESTING.md` - File ini (quick start guide)

### Automated Tests:
- `tests/auth.test.js` - 10 tests untuk authentication
- `tests/posts.test.js` - 9 tests untuk posts & feed
- `tests/follow.test.js` - 11 tests untuk follow/unfollow
- `tests/users.test.js` - 8 tests untuk user search
- `tests/health.test.js` - 2 tests untuk health check

### Konfigurasi:
- `jest.config.js` - Jest configuration
- `tests/setup.js` - Test setup file
- `tests/helpers/testUtils.js` - Helper functions
- `.env.test` - Test environment variables (sudah dibuat)
- `env.test.example` - Template untuk `.env.test`

## 🎯 Next Steps

1. **Fix Database Connection**: Edit `.env.test` dengan kredensial yang benar
2. **Run Tests**: `npm test`
3. **Review Results**: Lihat test results di terminal
4. **Check Coverage**: `npm run test:coverage` dan buka `coverage/lcov-report/index.html`

## 💡 Tips

- **Gunakan database terpisah untuk testing** - Jangan gunakan database production!
- **Tests akan drop & recreate tables** - Semua data di `ganapatih_test_db` akan dihapus
- **Run tests before push** - Pastikan semua tests pass sebelum commit/push
- **Add to CI/CD** - Integrate testing ke pipeline CI/CD Anda

## 📞 Support

Jika masih ada error:

1. Baca error message dengan teliti
2. Check kredensial database di `.env.test`
3. Pastikan PostgreSQL running
4. Lihat troubleshooting guide di atas
5. Baca dokumentasi lengkap di `tests/README.md`

---

**Status**: ✅ Setup Complete - Tinggal konfigurasi `.env.test` dan run tests!

**Date**: October 21, 2024

