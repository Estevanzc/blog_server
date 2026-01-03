const controller = require('./controller');
const { Blog, Member, Category, User, Comment, Follower, Member_request, Notification, Post_content, Post_like, Post_view, Post_tag, Tag, Post, Preference } = require('../../models');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const uploadConfig = require('../config/update');
const upload = multer(uploadConfig);
const fs = require('fs/promises');
const path = require('path');
const { Op, Sequelize } = require('sequelize');

module.exports = {
  async firstFiveUsed(req, res, next) {
    try {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const tags = await Tag.findAll({
        include: [{
          model: Post,
          as: 'posts',
          attributes: ['id', 'createdAt'],
          where: {
            createdAt: { [Op.gte]: startOfDay }
          },
          through: { attributes: [] }
        }],
        limit: 5
      });

      const tagsWithFirstUsedAt = tags.map(tag => {
        const firstUsedAt = tag.posts.length
          ? new Date(Math.min(...tag.posts.map(p => p.createdAt)))
          : null;
        return { ...tag.toJSON(), firstUsedAt };
      });

      return tagsWithFirstUsedAt;

    } catch (err) {
      next(err);
    }
  }
};
