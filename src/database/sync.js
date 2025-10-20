import dotenv from 'dotenv';
import sequelize from '../config/databaseConfig.js';

// Import semua models agar Sequelize mengenalinya
import '../models/userModel.js';
import '../models/postModel.js';
import '../models/followModel.js';
import '../models/tokenModel.js';

dotenv.config();

const syncDatabase = async () => {
  try {
    console.log('[sync] Starting database synchronization...');
    
    // Test koneksi
    await sequelize.authenticate();
    console.log('[sync] ✓ Database connection established');

    // Ambil mode dari argument atau gunakan default
    const mode = process.argv[2] || 'safe';
    
    let syncOptions = {};
    
    switch (mode) {
      case 'force':
        // DROP semua tabel dan recreate (HAPUS SEMUA DATA!)
        syncOptions = { force: true };
        console.log('[sync] ⚠️  WARNING: Force mode - All tables will be DROPPED and recreated!');
        console.log('[sync] ⚠️  ALL DATA WILL BE DELETED!');
        break;
        
      case 'alter':
        // Update struktur tabel tanpa hapus data
        syncOptions = { alter: true };
        console.log('[sync] 🔄 Alter mode - Tables will be updated to match models');
        break;
        
      case 'safe':
      default:
        // Hanya buat tabel jika belum ada (AMAN untuk production)
        syncOptions = { alter: false };
        console.log('[sync] ✅ Safe mode - Only create tables if they don\'t exist');
        break;
    }

    // Jalankan sync
    await sequelize.sync(syncOptions);
    
    console.log('[sync] ✓ Database synchronized successfully!');
    console.log('[sync] Models synced:');
    console.log('[sync]   - users');
    console.log('[sync]   - posts');
    console.log('[sync]   - follows');
    console.log('[sync]   - refresh_tokens');
    
    // Tutup koneksi
    await sequelize.close();
    console.log('[sync] ✓ Database connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('[sync] ✗ Error synchronizing database:', error);
    process.exit(1);
  }
};

// Jalankan sync
syncDatabase();

