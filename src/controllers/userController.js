const bcrypt = require('bcryptjs');
const { Sequelize } = require('sequelize');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const uploadConfig = require('../config/update');
const upload = multer(uploadConfig);
const fs = require('fs/promises');
const path = require('path');
const { Blog, Member, Category, User, Comment, Follower, Member_request, Notification, Post_content, Post_like, Post_view, Post_tag, Tag, Post, Preference } = require('../../models');
const controller = require('../controllers/controller');
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = {
  async profile(req, res, next) {
    try {
      let { id } = req.params
      let user = await User.findByPk(id, {
        attributes: {
          include: [
            [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('members.posts.id'))), 'postCount'],
            [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('members.blog.id'))), 'blogCount'],
            [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('followers.id'))), 'followerCount']
          ],
          exclude: ['password'],
        },
        include: [
          {
            model: Member,
            as: 'members',
            attributes: [],
            include: [
              {
                model: Post,
                as: 'posts',
                attributes: []
              },
              {
                model: Blog,
                as: 'blog',
                attributes: []
              }
            ]
          },
          { model: Follower, as: 'followers', attributes: [] }
        ],
        group: ['User.id']
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" })
      }
      return res.json(user)
    } catch (err) {
      next(err)
    }
  },
  async register(req, res, next) {
    try {
      const { name, email, password, password_confirmation, birth, occupation } = req.body;

      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        return res.status(400).json({ error: 'User already exists' });
      }
      if (password != password_confirmation) {
        return res.status(400).json({
          error: "Password and its confirmation doesn't match"
        })
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        birth
      });

      return res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email
      });
    } catch (err) {
      next(err);
    }
  },
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id },
        JWT_SECRET,
        { expiresIn: '1d' }
      );

      return res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      });
    } catch (err) {
      next(err);
    }
  },
  async update(req, res, next) {
    try {
      let { id, name, email, birth, description } = req.body
      let user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" })
      }
      if (req.user.id == id) {
        await user.update({
          name,
          email,
          birth,
          description
        });
        return res.status(202).json({
          message: "Profile data updated successfully"
        });
      }
      return res.status(403).json({ error: "Access denied" })
    } catch (err) {
      next(err)
    }
  },
  async updatePhoto(req, res, next) {
    try {
      const user_id = req.user.id;
      const user = await User.findByPk(user_id);

      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      await controller.imageUpload(user, req.file);

      return res.status(202).send();
    } catch (err) {
      next(err);
    }
  },
  async updateBanner(req, res, next) {
    try {
      const user_id = req.user.id;
      const user = await User.findByPk(user_id);

      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      await controller.imageUpload(user, req.file, "banner");

      return res.status(202).send();
    } catch (err) {
      next(err);
    }
  },
  async destroy(req, res, next) {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      if (req.user.id == id || req.user.admin) {
        if (user.photo) {
          const photoPath = path.resolve(
            __dirname,
            '..',
            '..',
            '..',
            user.photo.replace('/', '')
          );

          try {
            await fs.unlink(photoPath);
          } catch (err) {
          }
        }
        if (user.banner) {
          const bannerPath = path.resolve(
            __dirname,
            '..',
            '..',
            '..',
            user.banner.replace('/', '')
          );

          try {
            await fs.unlink(bannerPath);
          } catch (err) {
          }
        }
        await user.destroy();
        return res.status(204).send();
      }
      return res.status(403).json({ error: 'Access denied' });
    } catch (err) {
      next(err);
    }
  },
  async dark_mode(req, res, next) {
    try {
      const user = await User.findByPk(req.user.id);
      const newDarkMode = !user.dark_mode;
      await user.update({
        dark_mode: newDarkMode
      });
      return res.status(200).json({
        message: `Color mode set to ${newDarkMode ? "dark" : "light"}`,
        dark_mode: newDarkMode
      });
    } catch (err) {
      next(err);
    }
  },
};
