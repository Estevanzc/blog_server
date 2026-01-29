const controller = require('../controllers/controller');
const { sequelize, Blog, Member, Category, User, Comment, Follower, Member_request, Notification, Post_content, Post_like, Post_view, Post_tag, Tag, Post, Preference } = require('../../models');
const { Sequelize } = require('sequelize');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const uploadConfig = require('../config/update');
const upload = multer(uploadConfig);
const fs = require('fs/promises');
const path = require('path');
const { Op } = require("sequelize")

module.exports = {
  async index(req, res, next) {
    try {
      const { id } = req.params;

      const blog = await Blog.findByPk(id, {
        attributes: {
          include: [
            [Sequelize.fn('COUNT', Sequelize.col('posts.id')), 'postCount'],
          ],
        },
        include: [
          {
            model: Post,
            as: 'posts',
            attributes: [],
          },
          {
            model: Member,
            as: 'members',
            where: { role: 1 },
            include: [
              {
                model: User,
                as: 'user',
              },
            ],
          },
        ],
        group: [
          'Blog.id',
          'members.id',
          'members->user.id',
        ],
      });
      if (!blog) {
        return res.status(404).json({ error: 'Blog not found' });
      }
      return res.json(blog);
    } catch (err) {
      next(err);
    }
  },
  async user_blogs(req, res, next) {
    try {
      let { id } = req.params;
      const limit = parseInt(req.query.limit) || 10;
      const cursor = req.query.cursor;

      const options = {
        where: {
          blog_id: id
        },
        include: [{
          model: Blog,
          as: 'blog',
        }],
        order: [['id', 'DESC']],
        limit: limit + 1
      };

      if (cursor) {
        options.where.id = {
          [Op.lt]: cursor
        };
      }

      const members = await Member.findAll(options);

      const hasNextPage = members.length > limit;

      if (hasNextPage) {
        members.pop();
      }

      const nextCursor = members.length > 0 ? members[members.length - 1].id : null;

      return res.json({
        data: members,
        meta: {
          hasNextPage,
          nextCursor
        }
      });
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
          error: 'Missing required fields'
        });
      }

      const user_id = req.user.id;

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
          user_id: user_id,
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
          error: 'Missing required fields'
        });
      }
      let blog = await Blog.findByPk(id);
      if (!blog) {
        return res.status(404).json({
          error: "Blog not found"
        })
      }
      const admin_member = await Member.findOne({
        where: {
          user_id: req.user.id,
          blog_id: id,
          role: 1
        }
      });
      if (!admin_member) {
        return res.status(403).json({
          error: 'Access denied'
        });
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
        message: "Blog updated successfully!"
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
      const admin_member = await Member.findOne({
        where: {
          user_id: req.user.id,
          blog_id: id,
          role: 1
        }
      });
      if (!admin_member) {
        return res.status(403).json({
          error: 'Access denied'
        });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      await controller.imageUpload({
        model: blog,
        file: req.file,
        field: 'banner'
      });

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
      const admin_member = await Member.findOne({
        where: {
          user_id: req.user.id,
          blog_id: id,
          role: 1
        }
      });
      if (!admin_member) {
        return res.status(403).json({
          error: 'Access denied'
        });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      await controller.imageUpload({
        model: blog,
        file: req.file,
        field: 'photo'
      });

      return res.status(202).send();
    } catch (err) {
      next(err);
    }
  },
  async destroy(req, res, next) {
    try {
      let { id } = req.params;
      let blog = await Blog.findByPk(id);
      if (!blog) {
        return res.status(404).json({ error: 'Blog not found' });
      }
      const admin_member = await Member.findOne({
        where: {
          user_id: req.user.id,
          blog_id: id,
          role: 1
        }
      });
      if (!admin_member) {
        return res.status(403).json({
          error: 'Access denied'
        });
      }
      await blog.destroy()
      return res.json({ message: "Blog deleted successfully" })
    } catch (err) {
      next(err)
    }
  },
};
