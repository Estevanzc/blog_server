const controller = require('../controllers/controller');
const { sequelize, Blog, Member, Category } = require('../../models');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const uploadConfig = require('../config/update');
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
      const {
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

      const userId = req.user.id;

      const blog = await sequelize.transaction(async (t) => {
        const [categoryData] = await Category.findOrCreate({
          where: { name: category },
          transaction: t
        });
        const blog = await Blog.create({
          name,
          subname,
          description,
          category_id: categoryData.id
        }, { transaction: t });
        await Member.create({
          user_id: userId,
          blog_id: blog.id,
          role: 1
        }, { transaction: t });

        return blog;
      });

      return res.status(201).json({
        id: blog.id
      });

    } catch (err) {
      next(err);
    }
  },
  async update(req, res, next) {
    try {
      let {
        id,
        name,
        subname,
        description,
        category,
      } = req.body;
      if (!id || !name || !subname || !description || !category) {
        return res.status(400).json({
          message: 'Missing required fields'
        });
      }
      let blog = await Blog.findByPk(id);
      if (!blog) {
        return res.status(404).json({
          error: "Blog not found"
        })
      }
      let category_id = await Category.findOne({
        where: { name: category }
      })
      if (!category_id) {
        category_id = await Category.create({
          name: category
        })
      }
      category_id = category_id.id
      await blog.update({
        name,
        subname,
        description,
        category_id,
      });
      return res.status(201).json({
        message: "Blog updated succefully!"
      })
    } catch (err) {
      next(err);
    }
  },
  async updateBanner(req, res, next) {
    try {
      let { id } = req.body;
      let blog = await Blog.findByPk(id);

      if (!blog) {
        return res.status(404).json({ error: 'Blog not found' });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      await controller.imageUpload(blog, req.file, "banner");

      return res.status(202).send();
    } catch (err) {
      next(err);
    }
  },
  async updatePhoto(req, res, next) {
    try {
      let { id } = req.body;
      let blog = await Blog.findByPk(id);

      if (!blog) {
        return res.status(404).json({ error: 'Blog not found' });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      await controller.imageUpload(blog, req.file, "photo");

      return res.status(202).send();
    } catch (err) {
      next(err);
    }
  },
  async destroy(req, res, next) {
    try {
      let { id } = req.body;
      let blog = await Blog.findByPk(id);
      if (!blog) {
        return res.status(404).json({ error: 'Blog not found' });
      }
      await blog.destroy()
      return res.json({ message: "Blog deleted succefully" })
    } catch (err) {
      next(err)
    }
  },
};
