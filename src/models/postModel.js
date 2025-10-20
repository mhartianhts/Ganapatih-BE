import { DataTypes, Op } from 'sequelize';
import sequelize from '../config/databaseConfig.js';
import { User } from './userModel.js';

// Definisi Sequelize Model untuk Post
const Post = sequelize.define('Post', {
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
  content: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'posts',
  timestamps: false,
});

// Definisi Relasi
Post.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
User.hasMany(Post, { foreignKey: 'user_id' });

// Export model
export { Post };

// Fungsi untuk create post
export const createPost = async ({ userId, content }) => {
  const post = await Post.create({
    user_id: userId,
    content,
  });
  
  return post.toJSON();
};

// Fungsi untuk find post by ID
export const findPostById = async (id) => {
  const post = await Post.findByPk(id);
  return post ? post.toJSON() : null;
};

// Fungsi untuk find posts by user ID
export const findPostsByUserId = async (userId, { limit = 20, offset = 0 } = {}) => {
  const posts = await Post.findAll({
    where: { user_id: userId },
    order: [['created_at', 'DESC']],
    limit,
    offset,
  });

  return posts.map(post => post.toJSON());
};

// Fungsi untuk find feed posts
export const findFeedPosts = async ({ userId, limit = 10, offset = 0 }) => {
  // Query untuk mendapatkan feed: post sendiri + post dari yang difollow
  const posts = await Post.findAll({
    where: {
      [Op.or]: [
        { user_id: userId },
        {
          user_id: {
            [Op.in]: sequelize.literal(
              `(SELECT followee_id FROM follows WHERE follower_id = ${userId})`
            ),
          },
        },
      ],
    },
    order: [['created_at', 'DESC']],
    limit,
    offset,
  });

  return posts.map(post => post.toJSON());
};

export default {
  Post,
  createPost,
  findPostById,
  findPostsByUserId,
  findFeedPosts,
};
