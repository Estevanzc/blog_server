const controller = require('./controller');
const { sequelize, Blog, Member, Category, User, Comment, Follower, Member_request, Notification, Post_content, Post_like, Post_view, Post_tag, Tag, Post, Preference } = require('../../models');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const uploadConfig = require('../config/update');
const upload = multer(uploadConfig);
const fs = require('fs/promises');
const path = require('path');
const { Op, Sequelize, where } = require('sequelize');

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
  },
  async store(tags, post_id, transaction) {
    try {
      await Post_tag.destroy({
        where: {
          post_id: post_id
        }
      })
      const normalizedNames = [...new Set(
        tags.map(t => t.trim().toLowerCase())
      )];

      if (normalizedNames.length === 0) {
        await Post_tag.destroy({
          where: { post_id },
          transaction
        });
        return [];
      }
      const existingTags = await Tag.findAll({
        where: { name: normalizedNames },
        transaction
      });

      const existingMap = new Map(
        existingTags.map(tag => [tag.name, tag])
      );
      const missing = normalizedNames
        .filter(name => !existingMap.has(name))
        .map(name => ({ name }));

      let createdTags = [];
      if (missing.length > 0) {
        createdTags = await Tag.bulkCreate(missing, {
          transaction,
          returning: true
        });
      }
      const allTags = [...existingTags, ...createdTags];
      let tag_ids = allTags.map(tag => tag.id)
      let post_tags = tag_ids.map(tag_id => ({
        post_id: post_id,
        tag_id: tag_id
      }));
      if (post_tags.length > 0) {
        await Post_tag.bulkCreate(post_tags, {
          transaction
        });
      }
      await transaction.commit();

      return res.status(200).json({
        message: "Post tags created successfully"
      });

    } catch (error) {
      await transaction.rollback();
      return res.status(500).json({
        error: 'Failed to process tags'
      });
    }
  },
};
