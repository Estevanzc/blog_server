const controller = require('./controller');
const { sequelize, Blog, Member, Category, User, Comment, Follower, Member_request, Notification, Post_content, Post_like, Post_view, Post_tag, Tag, Post, Preference } = require('../../models');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const uploadConfig = require('../config/update');
const upload = multer(uploadConfig);
const fs = require('fs/promises');
const path = require('path');
const { Op, Sequelize } = require('sequelize');

module.exports = {
  async store(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      let { preferences } = req.body
      let user_id = req.user.id
      await Preference.destroy({
        where: { user_id },
        transaction
      });

      let data = preferences.map(pref => ({
        keyword: pref.keyword,
        user_id
      }));

      if (data.length > 0) {
        await Preference.bulkCreate(data, { transaction });
      }

      await transaction.commit();

      return res.status(200).json({
        message: 'Preferences updated successfully'
      });
    } catch (err) {
      next(err);
    }
  }
};
