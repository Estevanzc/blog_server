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
  async user_notifications(req, res, next) {
    try {
      let { id } = req.params
      let notifications = await Notification.findAll({
        where: { user_id: id },
      });
      return res.json(notifications)
    } catch (err) {
      next(err);
    }
  },
};
