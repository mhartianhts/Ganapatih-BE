import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

const sequelize = new Sequelize({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  dialect: 'postgres',
  logging: process.env.NODE_ENV !== 'production' ? console.log : false,
  pool: {
    max: process.env.DB_MAX_CONNECTIONS
      ? Number(process.env.DB_MAX_CONNECTIONS)
      : 20,
    min: 0,
    acquire: 30000,
    idle: process.env.DB_IDLE_TIMEOUT
      ? Number(process.env.DB_IDLE_TIMEOUT)
      : 10000,
  },
});

// Test koneksi
sequelize.authenticate()
  .then(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[database] Connection has been established successfully.');
    }
  })
  .catch((error) => {
    console.error('[database] Unable to connect to the database:', error);
  });

export default sequelize;
