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
  async blog_requests(req, res, next) {
    try {
      let { id } = req.params;

      const admin_member = await Member.findOne({
        where: {
          user_id: req.user.id,
          blog_id: id,
          role: 1
        }
      });

      if (!admin_member) {
        return res.status(403).json({
          error: 'Access denied'
        });
      }

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

      const requests = await Member_request.findAll(options);
      const hasNextPage = requests.length > limit;

      if (hasNextPage) {
        requests.pop();
      }

      const nextCursor = requests.length > 0 ? requests[requests.length - 1].id : null;

      return res.json({
        data: requests,
        meta: {
          hasNextPage,
          nextCursor
        }
      });
    } catch (err) {
      next(err);
    }
  },
  async user_requests(req, res, next) {
    try {
      let { id } = req.params;

      if (id != req.user.id) {
        return res.status(403).json({
          error: "Access denied"
        });
      }

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

      const requests = await Member_request.findAll(options);
      const hasNextPage = requests.length > limit;
      if (hasNextPage) {
        requests.pop();
      }
      const nextCursor = requests.length > 0 ? requests[requests.length - 1].id : null;

      return res.json({
        data: requests,
        meta: {
          hasNextPage,
          nextCursor
        }
      });
    } catch (err) {
      next(err);
    }
  },
  async store(req, res, next) {
    try {
      const user_id = req.user.id;
      const { id } = req.params;
      const blog = await Blog.findByPk(id);
      if (!blog) {
        return res.status(404).json({ error: "Blog not found" });
      }
      const member = await Member.findOne({
        where: {
          user_id: user_id,
          blog_id: id,
        }
      });
      if (!member) {
        const request = await Member_request.create({
          user_id: user_id,
          blog_id: blog.id
        });
        const admin = await Member.findOne({
          where: {
            blog_id: blog.id,
            role: 1
          }
        });
        await Notification.create({
          user_id: admin.user_id,
          name: `${req.user.name} wants to join ${blog.name}`,
          link: `/`
        });

        return res.json(request);
      }
      res.status(409).json({
        error: "User already is a member of the blog"
      })
    } catch (err) {
      next(err);
    }
  },
};
