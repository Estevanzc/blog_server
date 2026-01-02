const controller = require('../controllers/controller');
const { Blog, Post } = require('../../models');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const uploadConfig = require('../config/upload');
const upload = multer(uploadConfig);
const fs = require('fs/promises');
const path = require('path');

module.exports = {
  async blog_posts(req, res, next) {
    try {
      let { id } = req.params
      let posts = await Post.findAll({
        where: {
          blog_id: id
        },
        order: [['createdAt', 'DESC']]
      });
      return res.json(posts)
    } catch (err) {
      next(err);
    }
  },
  async user_posts(req, res, next) {
    try {
      let { id } = req.params
      let posts = await Post.findAll({
        where: {
          user_id: id
        },
        order: [['createdAt', 'DESC']]
      });
      return res.json(posts)
    } catch (err) {
      next(err);
    }
  },
};
