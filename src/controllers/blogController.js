const controller = require('../controllers/controller');
const { Blog, Member, Category } = require('../../models');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const uploadConfig = require('../config/upload');
const upload = multer(uploadConfig);
const fs = require('fs/promises');
const path = require('path');

module.exports = {
  async index(req, res, next) {
    try {
      let { id } = req.params
      const blog = await Blog.findByPk(id, {
        attributes: {
          include: [
            [Sequelize.fn('COUNT', Sequelize.col('posts.id')), 'postCount']
          ]
        },
        include: [{
          model: Member,
          as: 'members',
          where: { role: 1 },
          include: [{
            model: User,
            as: 'user',
          }]
        }]
      });
      if (!blog) {
        return res.status(404).json({ error: "Blog not found" })
      }
      return res.json(blog)
    } catch (err) {
      next(err);
    }
  },
  async user_blogs(req, res, next) {
    try {
      let { id } = req.params
      let blogs = await Member.findAll({
        where: { blog_id: id },
        include: [{
          model: Blog,
          as: 'blog',
        }]
      });
      return res.json(blogs)
    } catch (err) {
      next(err);
    }
  },
  async store(req, res, next) {
    try { 
      let {
        name,
        subname,
        description,
        category,
      } = req.body;
      if (!name || !subname || !description || !category) {
        return res.status(400).json({
          message: 'Missing required fields'
        });
      }
      
    } catch (err) {
      next(err);
    }
  },
};
