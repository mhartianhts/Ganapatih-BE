import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';

import {
  findUserByUsername,
  findUserById,
  createUser,
} from '../models/userModel.js';
import {
  createRefreshToken,
  findRefreshToken,
  deleteRefreshToken,
} from '../models/tokenModel.js';

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
const REFRESH_TOKEN_DAYS = Number(process.env.REFRESH_TOKEN_DAYS || 7);

if (!JWT_SECRET) {
  throw new Error('[authService] JWT_SECRET is not defined in environment variables');
}

const sanitizeUser = (user) => ({
  id: user.id,
  username: user.username,
  created_at: user.created_at,
});

const generateAccessToken = (user) =>
  jwt.sign({ sub: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

const generateRefreshToken = async (userId) => {
  const token = randomBytes(48).toString('hex');
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000);
  await createRefreshToken({ userId, token, expiresAt });
  return { token, expiresAt };
};

// Tidak perlu initAuth lagi - sequelize.sync() sudah handle otomatis

export const assertUserExists = async (id) => {
  const user = await findUserById(id);
  if (!user) {
    const error = new Error('User not found');
    error.status = 404;
    throw error;
  }
  return user;
};

export const registerUser = async ({ username, password }) => {
  const existing = await findUserByUsername(username);
  if (existing) {
    const error = new Error('Username already exists');
    error.status = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await createUser({ username, passwordHash });

  return {
    user: sanitizeUser(user),
  };
};

export const loginUser = async ({ username, password }) => {
  const user = await findUserByUsername(username);

  if (!user) {
    const error = new Error('Invalid credentials');
    error.status = 401;
    throw error;
  }

  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) {
    const error = new Error('Invalid credentials');
    error.status = 401;
    throw error;
  }

  const accessToken = generateAccessToken(user);
  const refresh = await generateRefreshToken(user.id);

  return {
    user: sanitizeUser(user),
    token: accessToken,
    refreshToken: refresh.token,
  };
};

export const refreshAccessToken = async ({ refreshToken }) => {
  if (!refreshToken || typeof refreshToken !== 'string') {
    const error = new Error('Refresh token is required');
    error.status = 400;
    throw error;
  }

  const record = await findRefreshToken(refreshToken);
  if (!record) {
    const error = new Error('Invalid refresh token');
    error.status = 401;
    throw error;
  }

  if (new Date(record.expires_at) <= new Date()) {
    await deleteRefreshToken(refreshToken);
    const error = new Error('Refresh token expired');
    error.status = 401;
    throw error;
  }

  const user = await assertUserExists(record.user_id);

  // Rotate refresh token
  await deleteRefreshToken(refreshToken);
  const newRefresh = await generateRefreshToken(user.id);
  const accessToken = generateAccessToken(user);

  return {
    token: accessToken,
    refreshToken: newRefresh.token,
  };
};

export default {
  registerUser,
  loginUser,
  refreshAccessToken,
};

