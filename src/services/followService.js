import {
  createFollow,
  deleteFollow,
  isFollowing,
} from '../models/followModel.js';
import { assertUserExists } from './authService.js';

// Tidak perlu initFollowModule lagi - sequelize.sync() sudah handle otomatis

export const followUser = async ({ followerId, followeeId }) => {
  if (Number(followerId) === Number(followeeId)) {
    const error = new Error('You cannot follow yourself');
    error.status = 400;
    throw error;
  }

  await assertUserExists(followerId);
  await assertUserExists(followeeId);

  const already = await isFollowing({ followerId, followeeId });
  if (already) {
    return { message: `You are already following user ${followeeId}` };
  }

  await createFollow({ followerId, followeeId });
  return { message: `You are now following user ${followeeId}` };
};

export const unfollowUser = async ({ followerId, followeeId }) => {
  await assertUserExists(followerId);
  await assertUserExists(followeeId);

  const already = await isFollowing({ followerId, followeeId });
  if (!already) {
    return { message: `You are not following user ${followeeId}` };
  }

  await deleteFollow({ followerId, followeeId });
  return { message: `You unfollowed user ${followeeId}` };
};

export default {
  followUser,
  unfollowUser,
};

