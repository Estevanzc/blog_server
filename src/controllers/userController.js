const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const uploadConfig = require('../config/update');
const upload = multer(uploadConfig);
const fs = require('fs/promises');
const path = require('path');
const { User } = require('../../models');
const controller = require('../controllers/controller');

module.exports = {
  async profile(req, res, next) {
    try {
      let { id } = req.params
      let user = await User.findByPk(id, {
        attributes: {
          include: [
            [Sequelize.fn('COUNT', Sequelize.col('posts.id')), 'postCount'],
            [Sequelize.fn('COUNT', Sequelize.col('blogs.id')), 'blogCount'],
            [Sequelize.fn('COUNT', Sequelize.col('followers.id')), 'followingCount'],
          ],
          exclude: ['password'],
        },
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
      const { name, email, password } = req.body;

      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        return res.status(400).json({ error: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        name,
        email,
        password: hashedPassword
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
      await user.update({
        name,
        email,
        birth,
        description
      });
      return res.status(202).send();
    } catch (err) {
      next(err)
    }
  },
  async updatePhoto(req, res, next) {
    try {
      const user_id = req.user.id;
      const user = await User.findByPk(user_id);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

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

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

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
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

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
    } catch (err) {
      next(err);
    }
  }
};
