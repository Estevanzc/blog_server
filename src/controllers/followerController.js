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
  async blog_followers(req, res, next) {
    try {
      let { id } = req.params
      let followers = await Follower.findAll({
        where: { blog_id: id },
        include: [{
          model: User,
          as: 'user',
        }]
      });
      return res.json(followers)
    } catch (err) {
      next(err);
    }
  },
  async user_following(req, res, next) {
    try {
      let { id } = req.params
      let following = await Follower.findAll({
        where: { user_id: id },
        include: [{
          model: Blog,
          as: 'blog',
        }]
      });
      return res.json(following)
    } catch (err) {
      next(err);
    }
  },
};
