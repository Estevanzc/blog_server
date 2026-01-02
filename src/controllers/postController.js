const controller = require('../controllers/controller');
const tagController = require('../controllers/tagController');
const { Blog, Post, Post_content } = require('../../models');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const uploadConfig = require('../config/upload');
const upload = multer(uploadConfig);
const fs = require('fs/promises');
const path = require('path');
const { Op, Sequelize } = require('sequelize');

module.exports = {
  async view(req, res, next) {
    try {
      const { id } = req.params;

      const post = await Post.findByPk(id, {
        attributes: {
          include: [
            [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('views.id'))), 'viewCount'],
            [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('likes.id'))), 'likeCount'],
            [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('comments.id'))), 'commentCount'],
          ]
        },
        include: [
          {
            model: View,
            as: 'views',
            attributes: [],
            required: false
          },
          {
            model: Like,
            as: 'likes',
            attributes: [],
            required: false
          },
          {
            model: Comment,
            as: 'comments',
            attributes: [],
            required: false
          },
          {
            model: Tag,
            as: 'tags',
          },
          {
            model: Member,
            as: 'member',
            include: [
              {
                model: User,
                as: 'user',
                attributes: ['id', 'username', 'avatar']
              },
              {
                model: Blog,
                as: 'blog',
                attributes: ['id', 'title', 'slug']
              }
            ]
          }
        ],
        group: [
          'Post.id',
          'tags.id',
          'member.id',
          'member->user.id',
          'member->blog.id'
        ]
      });

      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      const comments = await Comment.findAll({
        where: { post_id: id },
        include: [{ model: User, as: 'user', attributes: ['id', 'username', 'avatar'] }],
        order: [['createdAt', 'ASC']]
      });

      const post_content = await Post_content.findAll({
        where: { post_id: id },
        order: [['order', 'ASC']],
      });

      const tagIds = post.tags.map(tag => tag.id);

      const relatedPosts = await Post.findAll({
        where: { id: { [Sequelize.Op.ne]: id } },
        include: [
          {
            model: Tag,
            as: 'tags',
            where: { id: { [Sequelize.Op.in]: tagIds } },
            through: { attributes: [] }
          },
          {
            model: Member,
            as: 'member',
            include: [
              { model: User, as: 'user', attributes: ['id', 'username', 'avatar'] },
              { model: Blog, as: 'blog', attributes: ['id', 'title', 'slug'] }
            ]
          }
        ],
        distinct: true,
        limit: 5,
        order: [['createdAt', 'DESC']]
      });

      return res.json({
        post,
        comments,
        post_content,
        relatedPosts
      });

    } catch (err) {
      next(err);
    }
  },
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
            [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('comments.id'))), 'commentCount'],
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
          },
          {
            model: Member,
            as: 'member',
            include: [
              {
                model: User,
                as: 'user',
                attributes: ['id', 'username', 'avatar']
              }
            ]
          }
        ],
        group: [
          'Post.id',
          'member.id',
          'member->user.id'
        ],
        order: [[Sequelize.literal('(COUNT(DISTINCT views.id) * 1 + COUNT(DISTINCT likes.id) * 3 + COUNT(DISTINCT comments.id) * 2)'), 'DESC']],
        limit: 31,
        subQuery: false
      });
      const most_viewed = await Post.findAll({
        where: {
          createdAt: { [Op.gte]: since }
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
            where: { createdAt: { [Op.gte]: since } },
            required: false
          },
          {
            model: Like,
            as: 'likes',
            attributes: [],
            where: { createdAt: { [Op.gte]: since } },
            required: false
          },
          {
            model: Comment,
            as: 'comments',
            attributes: [],
            where: { createdAt: { [Op.gte]: since } },
            required: false
          },
          {
            model: Member,
            as: 'member',
            include: [
              {
                model: User,
                as: 'user',
                attributes: ['id', 'username', 'avatar']
              }
            ]
          }
        ],
        group: [
          'Post.id',
          'member.id',
          'member->user.id'
        ],
        order: [[
          Sequelize.literal('COUNT(DISTINCT views.id)'),
          'DESC'
        ]],
        limit: 5,
        subQuery: false
      });
      const most_liked = await Post.findAll({
        where: {
          createdAt: { [Op.gte]: since }
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
            where: { createdAt: { [Op.gte]: since } },
            required: false
          },
          {
            model: Like,
            as: 'likes',
            attributes: [],
            where: { createdAt: { [Op.gte]: since } },
            required: false
          },
          {
            model: Comment,
            as: 'comments',
            attributes: [],
            where: { createdAt: { [Op.gte]: since } },
            required: false
          },
          {
            model: Member,
            as: 'member',
            include: [
              {
                model: User,
                as: 'user',
                attributes: ['id', 'username', 'avatar']
              }
            ]
          }
        ],
        group: [
          'Post.id',
          'member.id',
          'member->user.id'
        ],
        order: [[
          Sequelize.literal('COUNT(DISTINCT likes.id) * 3'),
          'DESC'
        ]],
        limit: 5,
        subQuery: false
      });
      const most_commented = await Post.findAll({
        where: {
          createdAt: { [Op.gte]: since }
        },
        attributes: {
          include: [
            [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('comments.id'))), 'commentCount'],
          ]
        },
        include: [
          {
            model: View,
            as: 'views',
            attributes: [],
            where: { createdAt: { [Op.gte]: since } },
            required: false
          },
          {
            model: Like,
            as: 'likes',
            attributes: [],
            where: { createdAt: { [Op.gte]: since } },
            required: false
          },
          {
            model: Comment,
            as: 'comments',
            attributes: [],
            where: { createdAt: { [Op.gte]: since } },
            required: false
          },
          {
            model: Member,
            as: 'member',
            include: [
              {
                model: User,
                as: 'user',
                attributes: ['id', 'username', 'avatar']
              }
            ]
          }
        ],
        group: [
          'Post.id',
          'member.id',
          'member->user.id'
        ],
        order: [[
          Sequelize.literal('COUNT(DISTINCT comments.id) * 2'),
          'DESC'
        ]],
        limit: 5,
        subQuery: false
      });
      const trending_tags = await Tag.findAll({
        attributes: {
          include: [[Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('posts.id'))), 'postCount']]
        },
        include: [
          {
            model: Post,
            as: 'posts',
            attributes: [],
            where: {
              createdAt: { [Op.gte]: since }
            },
            through: { attributes: [] }
          }
        ],
        group: ['Tag.id'],
        order: [[Sequelize.literal('postCount'), 'DESC']],
        limit: 20,
        subQuery: false
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
    try {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const firstPost = await Post.findOne({
        where: {
          createdAt: {
            [Op.gte]: startOfDay
          }
        },
        include: [
          {
            model: Member,
            as: 'member',
            include: [
              {
                model: User,
                as: 'user',
                attributes: ['id', 'username', 'avatar']
              }
            ]
          }
        ],
        order: [['createdAt', 'ASC']]
      });

      const firstFiveTags = await tagController.firstFiveUsed(req, res, next);
      const tagIds = firstFiveTags.map(tag => tag.id);

      if (!tagIds.length) {
        return res.json({
          firstPost,
          recentPostsByTag: [],
          recentPosts: []
        });
      }

      const recentPostsByTag = await Post.findAll({
        include: [
          {
            model: Tag,
            as: 'tags',
            where: { id: tagIds },
            through: { attributes: [] }
          },
          {
            model: Member,
            as: 'member',
            include: [
              {
                model: User,
                as: 'user',
                attributes: ['id', 'username', 'avatar']
              }
            ]
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: 5,
        distinct: true
      });

      const recentPosts = await Post.findAll({
        include: [
          {
            model: Tag,
            as: 'tags',
            through: { attributes: [] }
          },
          {
            model: Member,
            as: 'member',
            include: [
              {
                model: User,
                as: 'user',
                attributes: ['id', 'username', 'avatar']
              }
            ]
          }
        ],
        order: [['createdAt', 'DESC']],
        distinct: true
      });

      return res.json({
        firstPost: firstPost,
        recentPostsByTag: recentPostsByTag,
        recentPosts: recentPosts
      });

    } catch (err) {
      next(err);
    }
  },
  async topics(req, res, next) {
    try {
      const topics = [
        'technology',
        'culture-and-society',
        'science',
        'politics',
        'art'
      ];

      const result = {};

      for (const topic of topics) {
        const posts = await Post.findAll({
          include: [
            {
              model: Tag,
              as: 'tags',
              where: { topic },
              through: { attributes: [] }
            },
            {
              model: Member,
              as: 'member',
              include: [
                {
                  model: User,
                  as: 'user',
                  attributes: ['id', 'username', 'avatar']
                }
              ]
            }
          ],
          order: [['createdAt', 'DESC']],
          limit: 5,
          distinct: true
        });

        result[topic] = posts;
      }

      const recentPosts = await Post.findAll({
        where: {
          status: 'published'
        },
        include: [
          {
            model: Tag,
            as: 'tags',
            through: { attributes: [] }
          },
          {
            model: Member,
            as: 'member',
            include: [
              {
                model: User,
                as: 'user',
                attributes: ['id', 'username', 'avatar']
              }
            ]
          }
        ],
        order: [['createdAt', 'DESC']],
        distinct: true
      });

      return res.json({
        topics: result,
        recentPosts
      });
    } catch (err) {
      next(err);
    }
  },
  async blog_posts(req, res, next) {
    try {
      let { id } = req.params
      const posts = await Post.findAll({
        include: [
          {
            model: Member,
            as: 'member',
            where: { blog_id: id },
            include: [
              {
                model: User,
                as: 'user',
                attributes: ['id', 'username', 'avatar']
              }
            ]
          }
        ],
        order: [['createdAt', 'DESC']]
      });
      return res.json(posts)
    } catch (err) {
      next(err);
    }
  },
  async user_posts(req, res, next) {
    try {
      const { id } = req.params;

      const posts = await Post.findAll({
        include: [
          {
            model: Member,
            as: 'member',
            where: { user_id: id },
            include: [
              {
                model: User,
                as: 'user',
                attributes: ['id', 'username', 'avatar']
              },
              {
                model: Blog,
                as: 'blog',
                attributes: ['id', 'title']
              }
            ]
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      return res.json(posts);
    } catch (err) {
      next(err);
    }
  }
};
