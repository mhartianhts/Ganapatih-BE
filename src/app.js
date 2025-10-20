import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';

import sequelize from './config/databaseConfig.js';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import followRoutes from './routes/followRoutes.js';
import userRoutes from './routes/userRoutes.js';
import errorHandler from './middlewares/errorHandler.js';
import { swaggerSpec } from './utils/swagger.js';

const app = express();

app.use(express.json());
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true,
}));

app.get('/health', async (_req, res) => {
  try {
    // Test koneksi dengan Sequelize
    await sequelize.authenticate();
    const [results] = await sequelize.query('SELECT NOW() AS current_time');
    res.json({ status: 'ok', database: results[0].current_time });
  } catch (error) {
    console.error('[server] Database health check failed', error);
    res.status(500).json({ status: 'error', message: 'Database connection failed' });
  }
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/auth', authRoutes);
app.use('/api', postRoutes);
app.use('/api', followRoutes);
app.use('/api', userRoutes);

app.use(errorHandler);

export default app;
