import { findUsers } from '../services/userService.js';

export const search = async (req, res, next) => {
  try {
    const { q, limit } = req.query;
    const users = await findUsers({ keyword: q, limit });
    res.json({ users });
  } catch (error) {
    next(error);
  }
};

export default {
  search,
};

