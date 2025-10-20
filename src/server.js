import dotenv from 'dotenv';
import app from './app.js';
import sequelize from './config/databaseConfig.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Test koneksi database
    await sequelize.authenticate();
    console.log('[server] Database connection established');

    // Sync semua models (otomatis membuat/update semua tabel)
    // { alter: false } - Aman untuk production, tidak ubah tabel yang sudah ada
    // { alter: true } - Untuk development, update struktur tabel otomatis
    // { force: true } - DANGER: Drop dan recreate tabel (hapus semua data!)
    await sequelize.sync({ alter: false });
    console.log('[server] All database models synchronized successfully');

  } catch (error) {
    console.error('[server] Unable to connect to database', error);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`[server] Server ready on port ${PORT}`);
  });
};

startServer();
