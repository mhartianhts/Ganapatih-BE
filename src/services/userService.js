import { searchUsers } from '../models/userModel.js';

export const findUsers = async ({ keyword, limit }) => {
  const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 50);
  const results = await searchUsers({ keyword, limit: safeLimit });
  return results.map((user) => ({ id: user.id, username: user.username }));
};

export default {
  findUsers,
};

