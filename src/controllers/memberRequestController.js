const controller = require('./controller');
const { Blog, User, Member_request } = require('../../models');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const uploadConfig = require('../config/upload');
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
};
