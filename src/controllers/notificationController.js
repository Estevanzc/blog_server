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
  async destroy(req, res, next) {
    try {
      const user_id = req.user.id;
      const { id } = req.body;
      const notification = await Notification.findByPk(id);
      if (!notification) {
        return res.status(404).json({
          error: "Notification not found"
        });
      }
      if (notification.user_id === user_id) {
        await notification.destroy();
        return res.status(202).json({
          message: "Notification deleted successfully"
        });
      }
      return res.status(403).json({
        error: "Permission denied"
      });
    } catch (err) {
      next(err);
    }
  }
};
