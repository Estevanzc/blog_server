const controller = require('./controller');
const { Blog, Member, Notification, User } = require('../../models');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const uploadConfig = require('../config/upload');
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
