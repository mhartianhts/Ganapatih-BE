import { DataTypes, Op } from 'sequelize';
import sequelize from '../config/databaseConfig.js';

// Definisi Sequelize Model untuk User
const User = sequelize.define('User', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  password_hash: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'users',
  timestamps: false,
});

// Export model untuk digunakan di model lain
export { User };

// Fungsi untuk find user by username
export const findUserByUsername = async (username) => {
  const user = await User.findOne({
    where: { username },
  });
  return user ? user.toJSON() : null;
};

// Fungsi untuk find user by ID
export const findUserById = async (id) => {
  const user = await User.findByPk(id);
  return user ? user.toJSON() : null;
};

// Fungsi untuk search users
export const searchUsers = async ({ keyword, limit = 10 }) => {
  const sanitized = keyword ? keyword.trim().toLowerCase() : '';
  
  const users = await User.findAll({
    where: {
      username: {
        [Op.iLike]: `%${sanitized}%`,
      },
    },
    attributes: ['id', 'username'],
    order: [['username', 'ASC']],
    limit,
  });

  return users.map(user => user.toJSON());
};

// Fungsi untuk create user
export const createUser = async ({ username, passwordHash }) => {
  const user = await User.create({
    username,
    password_hash: passwordHash,
  });
  
  return user.toJSON();
};

export default {
  User,
  findUserByUsername,
  findUserById,
  searchUsers,
  createUser,
};
