import {
  loginUser,
  registerUser,
  refreshAccessToken,
} from '../services/authService.js';

const validatePayload = ({ username, password }) => {
  if (!username || typeof username !== 'string' || !username.trim()) {
    const error = new Error('Username is required');
    error.status = 400;
    throw error;
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    const error = new Error('Password must be at least 6 characters');
    error.status = 422;
    throw error;
  }
};

export const register = async (req, res, next) => {
  try {
    validatePayload(req.body);
    const { username, password } = req.body;
    const { user } = await registerUser({ username: username.trim(), password });
    res.status(201).json({
      id: user.id,
      username: user.username,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    validatePayload(req.body);
    const { username, password } = req.body;
    const { token, refreshToken } = await loginUser({
      username: username.trim(),
      password,
    });
    res.json({ token, refreshToken });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: provided } = req.body;
    const result = await refreshAccessToken({ refreshToken: provided });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export default {
  register,
  login,
  refreshToken,
};

