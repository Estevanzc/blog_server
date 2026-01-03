const controller = require('./controller');
const { Blog, Member, Follower, User } = require('../../models');
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
