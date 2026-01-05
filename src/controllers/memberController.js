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
  async blog_members(req, res, next) {
    try {
      let { id } = req.params
      let members = await Member.findAll({
        where: { blog_id: id },
        include: [{
          model: User,
          as: 'user',
        }]
      });
      return res.json(members)
    } catch (err) {
      next(err);
    }
  },
  async user_membering(req, res, next) {
    try {
      let { id } = req.params
      let members = await Member.findAll({
        where: { user_id: id },
        include: [{
          model: Blog,
          as: 'blog',
        }]
      });
      return res.json(members)
    } catch (err) {
      next(err);
    }
  },
  async store(req, res, next) {
    try {
      const { id } = req.body;
      const request = await Member_request.findByPk(id);
      if (!request) {
        return res.status(404).json({
          message: "Membership Request not found"
        });
      }
      await Member.create({
        user_id: request.user_id,
        blog_id: request.blog_id,
      });

      await request.destroy();
      return res.status(201).json({
        message: "Membership Request Accepted Successfully"
      });
    } catch (err) {
      next(err);
    }
  },
  async destroy(req, res, next) {
    try {
      const user_id = req.user.id;
      let { id } = req.body;
      let blog = await Blog.findByPk(id);
      if (!blog) {
        return res.status(404).json({ error: 'Blog not found' });
      }
      const member = await Member.findOne({
        where: {
          user_id: user_id,
          blog_id: blog.id
        }
      });
      if (!member || member.role == 1) {
        return res.json({
          error: "Membership not found or unable to be destroyed"
        })
      }
      await member.destroy()
      return res.json({ message: "Membership deleted successfully" })
    } catch (err) {
      next(err)
    }
  },
};
