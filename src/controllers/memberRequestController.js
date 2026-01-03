const controller = require('./controller');
const { Sequelize } = require('sequelize');
const { Blog, Member, Category, User, Comment, Follower, Member_request, Notification, Post_content, Post_like, Post_view, Post_tag, Tag, Post, Preference } = require('../../models');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const uploadConfig = require('../config/update');
const upload = multer(uploadConfig);
const fs = require('fs/promises');
const path = require('path');

module.exports = {
  async blog_requests(req, res, next) {
    try {
      let { id } = req.params
      let requests = await Member_request.findAll({
        where: { blog_id: id },
        include: [{
          model: User,
          as: 'user',
        }]
      });
      return res.json(requests)
    } catch (err) {
      next(err);
    }
  },
  async user_requests(req, res, next) {
    try {
      let { id } = req.params
      let requests = await Member_request.findAll({
        where: { user_id: id },
        include: [{
          model: Blog,
          as: 'blog',
        }]
      });
      return res.json(requests)
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
    } catch (err) {
      next(err);
    }
  },
};
