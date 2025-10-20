import { followUser, unfollowUser } from '../services/followService.js';

export const follow = async (req, res, next) => {
  try {
    const followerId = req.user?.id;
    if (!followerId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const followeeId = Number(req.params.userid);
    if (!Number.isInteger(followeeId) || followeeId <= 0) {
      const error = new Error('Invalid user id');
      error.status = 400;
      throw error;
    }

    const result = await followUser({ followerId, followeeId });
    res.json({ message: result.message });
  } catch (error) {
    next(error);
  }
};

export const unfollow = async (req, res, next) => {
  try {
    const followerId = req.user?.id;
    if (!followerId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const followeeId = Number(req.params.userid);
    if (!Number.isInteger(followeeId) || followeeId <= 0) {
      const error = new Error('Invalid user id');
      error.status = 400;
      throw error;
    }

    const result = await unfollowUser({ followerId, followeeId });
    res.json({ message: result.message });
  } catch (error) {
    next(error);
  }
};

export default {
  follow,
  unfollow,
};

