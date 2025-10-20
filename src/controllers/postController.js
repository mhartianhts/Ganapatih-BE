import { createUserPost, getUserFeed } from '../services/postService.js';

export const createPost = async (req, res, next) => {
  try {
    const { content } = req.body;
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const post = await createUserPost({ userId, content });
    res.status(201).json({
      id: post.id,
      userid: post.user_id,
      content: post.content,
      createdat: post.created_at,
    });
  } catch (error) {
    next(error);
  }
};

export const getFeed = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { page = 1, limit = 10 } = req.query;
    const result = await getUserFeed({ userId, page, limit });
    res.json({
      page: result.page,
      posts: result.posts.map((post) => ({
        id: post.id,
        userid: post.user_id,
        content: post.content,
        createdat: post.created_at,
      })),
    });
  } catch (error) {
    next(error);
  }
};

export default {
  createPost,
  getFeed,
};

