const controller = require('./controller');
const { sequelize, Blog, Member, Category, User, Comment, Follower, Member_request, Notification, Post_content, Post_like, Post_view, Post_tag, Tag, Post, Preference, User_search } = require('../../models');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const uploadConfig = require('../config/update');
const upload = multer(uploadConfig);
const fs = require('fs/promises');
const path = require('path');
const { Op, Sequelize } = require('sequelize');

module.exports = {
  async search(req, res, next) {
    try {
      let { search_str } = req.params
      let user_id = req.user?.id ?? null;
      if (!search_str || !search_str.trim()) {
        return res.status(400).json({
          error: "Search string is required"
        });
      }
      if (user_id) {
        await User_search.create({
          name: search_str,
          user_id: user_id,
        });
      }
      const posts = await Post.findAll({
        where: {
          [Op.or]: [
            { title: { [Op.like]: `%${search_str}%` } },
            { subtitle: { [Op.like]: `%${search_str}%` } },
            { summary: { [Op.like]: `%${search_str}%` } },

            { "$contents.content$": { [Op.like]: `%${search_str}%` } }
          ]
        },
        include: [
          {
            model: Post_content,
            as: "contents",
            attributes: []
          }
        ],
        distinct: true,
        order: [["createdAt", "DESC"]]
      });
      const users = await User.findAll({
        where: {
          [Op.or]: [
            { name: { [Op.like]: `%${search_str}%` } },
          ]
        },
        order: [["createdAt", "DESC"]]
      });
      const blogs = await Blog.findAll({
        where: {
          [Op.or]: [
            { name: { [Op.like]: `%${search_str}%` } },
            { subname: { [Op.like]: `%${search_str}%` } },
            { description: { [Op.like]: `%${search_str}%` } }
          ]
        },
        order: [["createdAt", "DESC"]]
      });
      return res.status(200).json({
        posts: posts,
        blogs: blogs,
        users: users,
      })
    } catch (err) {
      next(err)
    }
  },
};
