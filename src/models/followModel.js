import { DataTypes } from 'sequelize';
import sequelize from '../config/databaseConfig.js';
import { User } from './userModel.js';

// Definisi Sequelize Model untuk Follow
const Follow = sequelize.define('Follow', {
  follower_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  followee_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'follows',
  timestamps: false,
});

// Definisi Relasi Many-to-Many
User.belongsToMany(User, {
  as: 'Followers',
  through: Follow,
  foreignKey: 'followee_id',
  otherKey: 'follower_id',
});

User.belongsToMany(User, {
  as: 'Following',
  through: Follow,
  foreignKey: 'follower_id',
  otherKey: 'followee_id',
});

// Export model
export { Follow };

// Fungsi untuk create follow
export const createFollow = async ({ followerId, followeeId }) => {
  try {
    // Validasi: tidak boleh follow diri sendiri
    if (followerId === followeeId) {
      return null;
    }

    const [follow, created] = await Follow.findOrCreate({
      where: {
        follower_id: followerId,
        followee_id: followeeId,
      },
      defaults: {
        follower_id: followerId,
        followee_id: followeeId,
      },
    });

    return created ? follow.toJSON() : null;
  } catch (error) {
    // Jika ada constraint violation, return null
    return null;
  }
};

// Fungsi untuk delete follow
export const deleteFollow = async ({ followerId, followeeId }) => {
  await Follow.destroy({
    where: {
      follower_id: followerId,
      followee_id: followeeId,
    },
  });
};

// Fungsi untuk check is following
export const isFollowing = async ({ followerId, followeeId }) => {
  const follow = await Follow.findOne({
    where: {
      follower_id: followerId,
      followee_id: followeeId,
    },
  });

  return follow !== null;
};

// Fungsi untuk count followers
export const countFollowers = async (userId) => {
  const count = await Follow.count({
    where: { followee_id: userId },
  });

  return count;
};

// Fungsi untuk count following
export const countFollowing = async (userId) => {
  const count = await Follow.count({
    where: { follower_id: userId },
  });

  return count;
};

export default {
  Follow,
  createFollow,
  deleteFollow,
  isFollowing,
  countFollowers,
  countFollowing,
};
