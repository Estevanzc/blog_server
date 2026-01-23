const controller = require('./controller');
const { Sequelize } = require('sequelize');
const { Blog, Member, Category, User, Comment, Follower, Member_request, Notification, Post_content, Post_like, Post_view, Post_tag, Tag, Post, Preference } = require('../../models');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const uploadConfig = require('../config/update');
const upload = multer(uploadConfig);
const fs = require('fs/promises');
const path = require('path');
const { Op } = require("sequelize")

module.exports = {
  async follow(req, res, next) {
    try {
      const user_id = req.user.id;
      const { id } = req.params;

      const blog = await Blog.findByPk(id);
      if (!blog) {
        return res.status(404).json({ error: "Blog not found" });
      }

      const follower = await Follower.findOne({
        where: {
          user_id: user_id,
          blog_id: blog.id
        }
      });

      if (!follower) {
        await Follower.create({
          blog_id: blog.id,
          user_id: user_id
        });
        return res.json({ message: "Followed successfully!" });
      } else {
        await follower.destroy();
        return res.json({ message: "Unfollowed successfully!" });
      }
    } catch (err) {
      next(err);
    }
  },
  async blog_followers(req, res, next) {
    try {
      let { id } = req.params;
      const limit = parseInt(req.query.limit) || 10;
      const cursor = req.query.cursor;

      const options = {
        where: {
          blog_id: id
        },
        include: [{
          model: User,
          as: 'user',
        }],
        order: [['id', 'DESC']],
        limit: limit + 1
      };

      if (cursor) {
        options.where.id = {
          [Op.lt]: cursor
        };
      }

      const followers = await Follower.findAll(options);

      const hasNextPage = followers.length > limit;

      if (hasNextPage) {
        followers.pop();
      }

      const nextCursor = followers.length > 0 ? followers[followers.length - 1].id : null;

      return res.json({
        data: followers,
        meta: {
          hasNextPage,
          nextCursor
        }
      });
    } catch (err) {
      next(err);
    }
  },
  async user_following(req, res, next) {
    try {
      let { id } = req.params;
      const limit = parseInt(req.query.limit) || 10;
      const cursor = req.query.cursor;

      const options = {
        where: {
          user_id: id
        },
        include: [{
          model: Blog,
          as: 'blog',
        }],
        order: [['id', 'DESC']],
        limit: limit + 1
      };

      if (cursor) {
        options.where.id = {
          [Op.lt]: cursor
        };
      }

      const followers = await Follower.findAll(options);

      const hasNextPage = followers.length > limit;

      if (hasNextPage) {
        followers.pop();
      }

      const nextCursor = followers.length > 0 ? followers[followers.length - 1].id : null;

      return res.json({
        data: followers,
        meta: {
          hasNextPage,
          nextCursor
        }
      });
    } catch (err) {
      next(err);
    }
  },
};
