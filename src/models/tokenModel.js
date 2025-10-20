import { DataTypes } from 'sequelize';
import sequelize from '../config/databaseConfig.js';
import { User } from './userModel.js';

// Definisi Sequelize Model untuk RefreshToken
const RefreshToken = sequelize.define('RefreshToken', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  token: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'refresh_tokens',
  timestamps: false,
});

// Definisi Relasi
RefreshToken.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
User.hasMany(RefreshToken, { foreignKey: 'user_id' });

// Export model
export { RefreshToken };

// Fungsi untuk create refresh token
export const createRefreshToken = async ({ userId, token, expiresAt }) => {
  const refreshToken = await RefreshToken.create({
    user_id: userId,
    token,
    expires_at: expiresAt,
  });

  return refreshToken.toJSON();
};

// Fungsi untuk find refresh token
export const findRefreshToken = async (token) => {
  const refreshToken = await RefreshToken.findOne({
    where: { token },
  });

  return refreshToken ? refreshToken.toJSON() : null;
};

// Fungsi untuk delete refresh token
export const deleteRefreshToken = async (token) => {
  await RefreshToken.destroy({
    where: { token },
  });
};

export default {
  RefreshToken,
  createRefreshToken,
  findRefreshToken,
  deleteRefreshToken,
};
