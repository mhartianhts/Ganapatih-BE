import {
  createPost,
  findFeedPosts,
} from '../models/postModel.js';
import { assertUserExists } from './authService.js';

// Tidak perlu initPostModule lagi - sequelize.sync() sudah handle otomatis

export const createUserPost = async ({ userId, content }) => {
  if (!content || typeof content !== 'string' || !content.trim()) {
    const error = new Error('Content is required');
    error.status = 400;
    throw error;
  }

  const trimmedContent = content.trim();
  if (trimmedContent.length > 200) {
    const error = new Error('Content must be at most 200 characters');
    error.status = 422;
    throw error;
  }

  await assertUserExists(userId);
  const post = await createPost({ userId, content: trimmedContent });
  return {
    id: post.id,
    user_id: post.user_id,
    content: post.content,
    created_at: post.created_at,
  };
};

export const getUserFeed = async ({ userId, page = 1, limit = 10 }) => {
  const parsedLimit = Number(limit) || 10;
  const parsedPage = Number(page) || 1;
  const safeLimit = parsedLimit > 0 ? Math.min(parsedLimit, 50) : 10;
  const safePage = parsedPage > 0 ? parsedPage : 1;
  const offset = (safePage - 1) * safeLimit;

  await assertUserExists(userId);
  const posts = await findFeedPosts({ userId, limit: safeLimit, offset });

  return {
    page: safePage,
    posts: posts.map((post) => ({
      id: post.id,
      user_id: post.user_id,
      content: post.content,
      created_at: post.created_at,
    })),
  };
};

export default {
  createUserPost,
  getUserFeed,
};

