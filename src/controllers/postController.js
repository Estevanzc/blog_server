const controller = require('../controllers/controller');
const tagController = require('../controllers/tagController');
const { Blog, Post } = require('../../models');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const uploadConfig = require('../config/upload');
const upload = multer(uploadConfig);
const fs = require('fs/promises');
const path = require('path');
const { Op, Sequelize } = require('sequelize');

module.exports = {
  async popular(req, res, next) {
    try {
      let since = new Date();
      since.setDate(since.getDate() - 30);

      let trending_posts = await Post.findAll({
        where: {
          createdAt: {
            [Op.gte]: since
          }
        },
        attributes: {
          include: [
            [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('views.id'))), 'viewCount'],
            [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('likes.id'))), 'likeCount'],
            [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('comments.id'))), 'commentCount']
          ]
        },
        include: [
          {
            model: View,
            as: 'views',
            attributes: [],
            where: {
              createdAt: { [Op.gte]: since }
            },
            required: false
          },
          {
            model: Like,
            as: 'likes',
            attributes: [],
            where: {
              createdAt: { [Op.gte]: since }
            },
            required: false
          },
          {
            model: Comment,
            as: 'comments',
            attributes: [],
            where: {
              createdAt: { [Op.gte]: since }
            },
            required: false
          }
        ],
        group: ['Post.id'],
        order: [[
          Sequelize.literal(
            '(COUNT(DISTINCT views.id) * 1 + COUNT(DISTINCT likes.id) * 3 + COUNT(DISTINCT comments.id) * 2)'
          ),
          'DESC'
        ]],
        limit: 31
      });
      let most_viewed = await Post.findAll({
        where: {
          createdAt: {
            [Op.gte]: since
          }
        },
        attributes: {
          include: [
            [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('views.id'))), 'viewCount'],
          ]
        },
        include: [
          {
            model: View,
            as: 'views',
            attributes: [],
            where: {
              createdAt: { [Op.gte]: since }
            },
            required: false
          },
          {
            model: Like,
            as: 'likes',
            attributes: [],
            where: {
              createdAt: { [Op.gte]: since }
            },
            required: false
          },
          {
            model: Comment,
            as: 'comments',
            attributes: [],
            where: {
              createdAt: { [Op.gte]: since }
            },
            required: false
          }
        ],
        group: ['Post.id'],
        order: [[
          Sequelize.literal(
            '(COUNT(DISTINCT views.id)'
          ),
          'DESC'
        ]],
        limit: 5
      });
      let most_liked = await Post.findAll({
        where: {
          createdAt: {
            [Op.gte]: since
          }
        },
        attributes: {
          include: [
            [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('likes.id'))), 'likeCount'],
          ]
        },
        include: [
          {
            model: View,
            as: 'views',
            attributes: [],
            where: {
              createdAt: { [Op.gte]: since }
            },
            required: false
          },
          {
            model: Like,
            as: 'likes',
            attributes: [],
            where: {
              createdAt: { [Op.gte]: since }
            },
            required: false
          },
          {
            model: Comment,
            as: 'comments',
            attributes: [],
            where: {
              createdAt: { [Op.gte]: since }
            },
            required: false
          }
        ],
        group: ['Post.id'],
        order: [[
          Sequelize.literal(
            'COUNT(DISTINCT likes.id) * 3'
          ),
          'DESC'
        ]],
        limit: 5
      });
      let most_commented = await Post.findAll({
        where: {
          createdAt: {
            [Op.gte]: since
          }
        },
        attributes: {
          include: [
            [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('comments.id'))), 'commentCount']
          ]
        },
        include: [
          {
            model: View,
            as: 'views',
            attributes: [],
            where: {
              createdAt: { [Op.gte]: since }
            },
            required: false
          },
          {
            model: Like,
            as: 'likes',
            attributes: [],
            where: {
              createdAt: { [Op.gte]: since }
            },
            required: false
          },
          {
            model: Comment,
            as: 'comments',
            attributes: [],
            where: {
              createdAt: { [Op.gte]: since }
            },
            required: false
          }
        ],
        group: ['Post.id'],
        order: [[
          Sequelize.literal(
            'COUNT(DISTINCT comments.id) * 2'
          ),
          'DESC'
        ]],
        limit: 5
      });
      let trending_tags = await Tag.findAll({
        attributes: {
          include: [
            [Sequelize.fn('COUNT', Sequelize.col('posts.id')), 'postCount']
          ]
        },
        include: [{
          model: Post,
          as: 'posts',
          attributes: [],
          where: {
            createdAt: { [Op.gte]: since }
          }
        }],
        group: ['Tag.id'],
        order: [[Sequelize.literal('postCount'), 'DESC']],
        limit: 20
      });
      return res.json({
        "trending_posts": trending_posts,
        "most_viewed": most_viewed,
        "most_liked": most_liked,
        "most_commented": most_commented,
        "trending_tags": trending_tags
      })
    } catch (err) {
      next(err);
    }
  },
  async recents(req, res, next) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const firstPost = await Post.findOne({
      where: {
        createdAt: {
          [Op.gte]: startOfDay
        }
      },
      order: [['createdAt', 'ASC']]
    })
    let firstFiveTags = await tagController.firstFiveUsed(req, res, next);
    const tagIds = firstFiveTags.map(tag => tag.id);

    if (!tagIds.length) {
      return res.json([]);
    }

    let recentPostsByTag = await Post.findAll({
      where: {
      },
      include: [{
        model: Tag,
        as: 'tags',
        where: {
          id: tagIds
        },
        through: { attributes: [] }
      }],
      order: [['createdAt', 'DESC']],
      limit: 5,
      distinct: true
    });
    let recentPosts = await Post.findAll({
      where: {
      },
      include: [{
        model: Tag,
        as: 'tags',
      }],
      order: [['createdAt', 'DESC']],
      distinct: true
    });
    return res.json({
      "firstPost": firstPost,
      "recentPostsByTag": recentPostsByTag,
      "recentPosts": recentPosts
    })
  },
  async blog_posts(req, res, next) {
    try {
      let { id } = req.params
      let posts = await Post.findAll({
        where: {
          blog_id: id
        },
        order: [['createdAt', 'DESC']]
      });
      return res.json(posts)
    } catch (err) {
      next(err);
    }
  },
  async user_posts(req, res, next) {
    try {
      let { id } = req.params
      let posts = await Post.findAll({
        where: {
          user_id: id
        },
        order: [['createdAt', 'DESC']]
      });
      return res.json(posts)
    } catch (err) {
      next(err);
    }
  },
};
