import sequelize from '../../src/config/databaseConfig.js';
import { User } from '../../src/models/userModel.js';
import { Post } from '../../src/models/postModel.js';
import { Follow } from '../../src/models/followModel.js';
import { RefreshToken } from '../../src/models/tokenModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

/**
 * Setup database untuk testing
 */
export async function setupDatabase() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true }); // Drop dan recreate semua tabel
  } catch (error) {
    console.error('Failed to setup test database:', error);
    throw error;
  }
}

/**
 * Cleanup database setelah testing
 */
export async function cleanupDatabase() {
  try {
    await RefreshToken.destroy({ where: {}, truncate: true, cascade: true });
    await Follow.destroy({ where: {}, truncate: true, cascade: true });
    await Post.destroy({ where: {}, truncate: true, cascade: true });
    await User.destroy({ where: {}, truncate: true, cascade: true });
  } catch (error) {
    console.error('Failed to cleanup test database:', error);
  }
}

/**
 * Tutup koneksi database
 */
export async function closeDatabase() {
  try {
    await sequelize.close();
  } catch (error) {
    console.error('Failed to close database connection:', error);
  }
}

/**
 * Membuat user untuk testing
 */
export async function createTestUser(username = 'testuser', password = 'password123') {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    username,
    password_hash: hashedPassword,
  });
  return user.toJSON();
}

/**
 * Generate JWT token untuk testing
 */
export function generateTestToken(userId, username = 'testuser') {
  return jwt.sign(
    { sub: userId, username: username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
}

/**
 * Generate refresh token untuk testing
 */
export function generateTestRefreshToken(userId) {
  return jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
  );
}

/**
 * Membuat post untuk testing
 */
export async function createTestPost(userId, content = 'Test post content') {
  const post = await Post.create({
    user_id: userId,
    content,
  });
  return post.toJSON();
}

/**
 * Membuat follow relationship untuk testing
 */
export async function createTestFollow(followerId, followeeId) {
  const follow = await Follow.create({
    follower_id: followerId,
    followee_id: followeeId,
  });
  return follow.toJSON();
}

