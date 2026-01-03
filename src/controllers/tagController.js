const controller = require('./controller');
const { Blog, Post } = require('../../models');
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
        attributes: [
          'id',
          'name',
          'slug',
          [Sequelize.fn('MIN', Sequelize.col('posts.publishedAt')), 'firstUsedAt']
        ],
        include: [{
          model: Post,
          as: 'posts',
          attributes: [],
          where: {
            status: 'published',
            publishedAt: {
              [Op.gte]: startOfDay
            }
          },
          through: { attributes: [] }
        }],
        group: ['Tag.id'],
        order: [[Sequelize.literal('firstUsedAt'), 'ASC']],
        limit: 5
      });
      return tags;
    } catch (err) {
      next(err);
    }
  }
};
