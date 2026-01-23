const controller = require('../controllers/controller');
const tagController = require('../controllers/tagController');
const postContentController = require('../controllers/postContentController');
const { sequelize, Blog, Member, Category, User, Comment, Follower, Member_request, Notification, Post_content, Post_like, Post_view, Post_tag, Tag, Post, Preference } = require('../../models');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const uploadConfig = require('../config/update');
const upload = multer(uploadConfig);
const fs = require('fs/promises');
const path = require('path');
const { Op, Sequelize, where } = require('sequelize');

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
            model: Post_view,
            as: 'views',
            attributes: [],
            required: false
          },
          {
            model: Post_like,
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
            attributes: ['id', 'name'],
            through: { attributes: [] }
          },
          {
            model: Member,
            as: 'member',
            include: [
              {
                model: User,
                as: 'user',
                attributes: ['id', 'name', 'photo']
              },
              {
                model: Blog,
                as: 'blog',
                attributes: ['id', 'name', 'photo']
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
      let user_id = req.user?.id ?? null;
      await Post_view.create({
        user_id: user_id,
        post_id: post.id
      })
      const view_count = await Post_view.count({
        where: { post_id: post.id }
      });
      if ([10, 100, 1000].includes(view_count)) {
        const adminMember = await Member.findOne({
          where: {
            blog_id: post.blog_id,
            admin: true
          }
        });
        await Notification.create({
          user_id: adminMember.user_id,
          message: `Post "${post.title}" reached ${view_count} views`,
          link: "/"
        });
      }

      const comments = await Comment.findAll({
        where: { post_id: id },
        include: [{ model: User, as: 'user', attributes: ['id', 'name', 'photo'] }],
        order: [['createdAt', 'ASC']]
      });

      const post_content = await Post_content.findAll({
        where: { post_id: id },
        order: [['order', 'ASC']],
      });
      const tagIds = (post.tags || [])
        .map(pt => pt.tag?.id)
        .filter(Boolean);

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
              { model: User, as: 'user', attributes: ['id', 'name', 'photo'] },
              { model: Blog, as: 'blog', attributes: ['id', 'name', 'photo'] }
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
  async home(req, res, next) {
    try {
      let since = new Date();
      since.setDate(since.getDate() - 30);
      let trending_post = await Post.findAll({
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
            model: Post_view,
            as: 'views',
            attributes: [],
            where: {
              createdAt: { [Op.gte]: since }
            },
            required: false
          },
          {
            model: Post_like,
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
                attributes: ['id', 'name', 'photo']
              }
            ]
          },
          {
            model: Tag,
            as: 'tags',
            attributes: ['id', 'name'],
            through: { attributes: [] }
          }
        ],
        group: [
          'Post.id',
          'member.id',
          'member->user.id',
          'tags.id'
        ],
        order: [[Sequelize.literal('(COUNT(DISTINCT views.id) * 1 + COUNT(DISTINCT likes.id) * 3 + COUNT(DISTINCT comments.id) * 2)'), 'DESC']],
        limit: 1,
        subQuery: false
      });
      const relatedPosts = await Post.findAll({
        where: {
          id: { [Op.ne]: trending_post[0].id }
        },
        include: [
          {
            model: Tag,
            as: 'tags',
            attributes: ['id', 'name'],
            through: { attributes: [] }
          },
          {
            model: Member,
            as: 'member',
            include: [
              { model: User, as: 'user' }
            ]
          }
        ],
        distinct: true,
        limit: 5,
        order: [['createdAt', 'DESC']]
      });
      const recentPosts = await Post.findAll({
        include: [
          {
            model: Tag,
            as: 'tags',
            attributes: ['id', 'name'],
            through: { attributes: [] }
          },
          {
            model: Member,
            as: 'member',
            include: [
              {
                model: User,
                as: 'user',
                attributes: ['id', 'name', 'photo']
              }
            ]
          }
        ],
        order: [['createdAt', 'DESC']],
        distinct: true
      });
      return res.json({
        trending_post: trending_post[0],
        relatedPosts: relatedPosts,
        recentPosts: recentPosts
      })
    } catch (err) {
      next(err);
    }
  },
  async following_posts(req, res, next) {
    try {
      let { id } = req.params
      const followedBlogs = await Follower.findAll({
        where: { user_id: id },
        attributes: ['blog_id']
      });

      const blogIds = followedBlogs.map(f => f.blog_id);

      if (!blogIds.length) {
        return res.json({ posts: [] });
      }
      const posts = await Post.findAll({
        include: [
          {
            model: Blog,
            as: 'blog',
            where: { id: { [Op.in]: blogIds } },
            attributes: ['id', 'name', 'photo']
          },
          {
            model: Tag,
            as: 'tags',
            attributes: ['id', 'name'],
            through: { attributes: [] }
          },
          {
            model: Member,
            as: 'member',
            include: [
              { model: User, as: 'user', attributes: ['id', 'name', 'photo'] }
            ]
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: 20,
        distinct: true
      });
      return res.json(posts)
    } catch (err) {
      next(err);
    }
  },
  async keywordPosts(req, res, next) {
    try {
      let { id } = req.params
      const preferences = await Preference.findAll({
        where: { user_id: id },
        attributes: ['keyword']
      });

      const keywords = preferences.map(p => p.keyword);

      if (!keywords.length) {
        return res.json({ posts: [] });
      }
      const searchConditions = keywords.map(keyword => ({
        [Op.or]: [
          { title: { [Op.iLike]: `%${keyword}%` } },
          { subtitle: { [Op.iLike]: `%${keyword}%` } },
          { summary: { [Op.iLike]: `%${keyword}%` } }
        ]
      }));
      const posts = await Post.findAll({
        where: {
          [Op.or]: searchConditions
        },
        include: [
          {
            model: Tag,
            as: 'tags',
            attributes: ['id', 'name'],
            through: { attributes: [] }
          },
          {
            model: Member,
            as: 'member',
            include: [
              { model: User, as: 'user', attributes: ['id', 'name', 'photo'] }
            ]
          }
        ],
        order: [['createdAt', 'DESC']],
        distinct: true,
        limit: 20
      });
      return res.json(posts);
    } catch (err) {
      next(err);
    }
  },
  async postHistory(req, res, next) {
    try {
      let { id } = req.params
      const viewedPosts = await Post_view.findAll({
        where: { user_id: id },
        include: [
          {
            model: Post,
            as: 'post',
            include: [
              {
                model: Tag,
                as: 'tags',
                attributes: ['id', 'name'],
                through: { attributes: [] }
              },
              {
                model: Member,
                as: 'member',
                include: [
                  { model: User, as: 'user', attributes: ['id', 'name', 'photo'] }
                ]
              }
            ]
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: 50
      });
      return res.json(viewedPosts);
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
            model: Post_view,
            as: 'views',
            attributes: [],
            where: {
              createdAt: { [Op.gte]: since }
            },
            required: false
          },
          {
            model: Post_like,
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
                attributes: ['id', 'name', 'photo']
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
            model: Post_view,
            as: 'views',
            attributes: [],
            where: { createdAt: { [Op.gte]: since } },
            required: false
          },
          {
            model: Post_like,
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
                attributes: ['id', 'name', 'photo']
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
            model: Post_view,
            as: 'views',
            attributes: [],
            where: { createdAt: { [Op.gte]: since } },
            required: false
          },
          {
            model: Post_like,
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
                attributes: ['id', 'name', 'photo']
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
            model: Post_view,
            as: 'views',
            attributes: [],
            where: { createdAt: { [Op.gte]: since } },
            required: false
          },
          {
            model: Post_like,
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
                attributes: ['id', 'name', 'photo']
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
        where: { createdAt: { [Op.gte]: startOfDay } },
        include: [
          {
            model: Member,
            as: 'member',
            include: [
              { model: User, as: 'user', attributes: ['id', 'name', 'photo'] }
            ]
          }
        ],
        order: [['createdAt', 'ASC']]
      });

      const firstFiveTags = await tagController.firstFiveUsed(req, res, next);
      const tagIds = (firstFiveTags || []).map(tag => tag.id);

      let recentPostsByTag = [];
      if (tagIds.length > 0) {
        recentPostsByTag = await Post.findAll({
          include: [
            {
              model: Tag,
              as: 'tags',
              where: { id: { [Op.in]: tagIds } },
              attributes: ['id', 'name'],
              through: { attributes: [] }
            },
            {
              model: Member,
              as: 'member',
              include: [
                { model: User, as: 'user', attributes: ['id', 'name', 'photo'] }
              ]
            }
          ],
          order: [['createdAt', 'DESC']],
          limit: 5,
          distinct: true
        });
      }

      const recentPosts = await Post.findAll({
        include: [
          {
            model: Tag,
            as: 'tags',
            attributes: ['id', 'name'],
            through: { attributes: [] }
          },
          {
            model: Member,
            as: 'member',
            include: [
              { model: User, as: 'user', attributes: ['id', 'name', 'photo'] }
            ]
          }
        ],
        order: [['createdAt', 'DESC']],
        distinct: true
      });

      return res.json({
        firstPost,
        recentPostsByTag,
        recentPosts
      });

    } catch (err) {
      next(err);
    }
  },
  async topics(req, res, next) {
    try {
      const topics = [
        'ai',
        'business',
        'health',
        'education',
        'food',
        'technology',
        'science',
        'art',
        'culture',
        'politics',
      ];

      const result = {};

      for (const topic of topics) {
        const posts = await Post.findAll({
          include: [
            {
              model: Tag,
              as: 'tags',
              where: { name: topic },
              attributes: ['id', 'name'],
              through: { attributes: [] }
            },
            {
              model: Member,
              as: 'member',
              include: [
                {
                  model: User,
                  as: 'user',
                  attributes: ['id', 'name', 'photo']
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
        include: [
          {
            model: Tag,
            as: 'tags',
            attributes: ['id', 'name'],
            through: { attributes: [] }
          },
          {
            model: Member,
            as: 'member',
            include: [
              {
                model: User,
                as: 'user',
                attributes: ['id', 'name', 'photo']
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
      let { id } = req.params;
      const limit = parseInt(req.query.limit) || 10;
      const cursor = req.query.cursor;
      const options = {
        where: {
          blog_id: id
        },
        order: [['id', 'DESC']],
        limit: limit + 1
      };
      if (cursor) {
        options.where.id = {
          [Op.lt]: cursor
        };
      }
      const posts = await Post.findAll(options);
      const hasNextPage = posts.length > limit;
      if (hasNextPage) {
        posts.pop();
      }
      const nextCursor = posts.length > 0 ? posts[posts.length - 1].id : null;

      return res.json({
        data: posts,
        meta: {
          hasNextPage,
          nextCursor
        }
      });
    } catch (err) {
      next(err);
    }
  },
  async user_posts(req, res, next) {
    try {
      const { id } = req.params;

      const limit = parseInt(req.query.limit) || 10;
      const cursor = req.query.cursor;
      const options = {
        where: {},
        include: [
          {
            model: Member,
            as: 'member',
            where: { user_id: id },
            include: [
              {
                model: User,
                as: 'user',
                attributes: ['id', 'name', 'photo'],
              },
            ],
          },
        ],
        order: [['id', 'DESC']],
        limit: limit + 1,
      };
      if (cursor) {
        options.where.id = {
          [Op.lt]: cursor
        };
      }

      const posts = await Post.findAll(options);
      const hasNextPage = posts.length > limit;

      if (hasNextPage) {
        posts.pop();
      }
      const nextCursor = posts.length > 0 ? posts[posts.length - 1].id : null;

      return res.json({
        data: posts,
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
    let transaction;
    try {
      transaction = await sequelize.transaction();

      const { title, subtitle, summary, blog_id, contents, tags } = req.body;
      const user_id = req.user.id;
      const member = await Member.findOne({
        where: { blog_id, user_id },
        transaction
      });
      if (!member) {
        await transaction.rollback();
        return res.status(403).json({
          error: 'You are not a member of the blog'
        });
      }
      const post = await Post.create({
        title,
        subtitle,
        summary,
        blog_id,
        member_id: member.id
      }, { transaction });
      await tagController.store(tags, post.id, transaction);
      const blocks = contents.map(block => ({
        type: block.type,
        content: block.content,
        order: block.order,
        post_id: post.id
      }));
      await Post_content.bulkCreate(blocks, { transaction });
      await transaction.commit();
      return res.status(201).json({ id: post.id });
    } catch (err) {
      if (transaction) {
        await transaction.rollback();
      }
      next(err);
    }
  },
  async imageContentUpload(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: 'No image file provided'
        })
      }
      const imagePath = await uploadImage({
        file: req.file
      })
      return res.status(201).json({
        path: imagePath
      })
    } catch (err) {
      next(err)
    }
  },
  async update(req, res, next) {
    let transaction;

    try {
      transaction = await sequelize.transaction();
      const { title, subtitle, summary, contents, tags, post_id } = req.body;
      const user_id = req.user.id;
      const post = await Post.findOne({
        where: { id: post_id },
        include: {
          model: Member,
          as: "member",
          required: true,
          where: { user_id }
        },
        transaction
      });
      if (!post) {
        await transaction.rollback();
        return res.status(403).json({
          error: 'You are not allowed to edit this post'
        });
      }
      if (!Array.isArray(contents)) {
        await transaction.rollback();
        return res.status(400).json({
          error: 'Invalid contents'
        });
      }
      await post.update(
        { title, subtitle, summary },
        { transaction }
      );
      await postContentController.destroyContent(post_id, transaction);
      const blocks = contents.map((block, index) => ({
        post_id,
        type: block.type,
        content: block.content,
        order: index
      }));
      await tagController.store(tags, post.id, transaction);
      await Post_content.bulkCreate(blocks, { transaction });
      await transaction.commit();
      return res.status(203).json({
        message: "Post updated successfully"
      });
    } catch (err) {
      if (transaction) {
        await transaction.rollback();
      }
      next(err);
    }
  },
  async destroy(req, res, next) {
    let transaction;
    try {
      transaction = await sequelize.transaction();
      const user_id = req.user.id;
      const { id } = req.params;
      const post = await Post.findByPk(id, { transaction });
      if (!post) {
        await transaction.rollback();
        return res.status(404).json({
          error: "Post not found"
        });
      }
      const member = await Member.findOne({
        where: {
          user_id,
          blog_id: post.blog_id
        },
        transaction
      });
      let post_member = await Member.findByPk(post.member_id)
      let isAuthor = post_member && post_member.user_id == user_id
      if (!member || (member.role !== 1 && !isAuthor)) {
        await transaction.rollback();
        return res.status(403).json({
          error: "You are not allowed to delete this post"
        });
      }
      await postContentController.destroyContent(id, transaction);
      await post.destroy({ transaction });
      await transaction.commit();
      return res.status(202).json({
        message: "Post deleted successfully"
      });
    } catch (err) {
      if (transaction) {
        await transaction.rollback();
      }
      next(err);
    }
  },
  async like(req, res, next) {
    try {
      const user_id = req.user.id;
      const { id } = req.params;

      const post = await Post.findByPk(id);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      const like = await Post_like.findOne({
        where: {
          user_id: user_id,
          post_id: post.id
        }
      });

      if (!like) {
        await Post_like.create({
          post_id: post.id,
          user_id: user_id
        });
        const like_count = await Post_like.count({
          where: { post_id: post.id }
        });
        if ([10, 100, 1000].includes(like_count)) {
          const adminMember = await Member.findOne({
            where: {
              blog_id: post.blog_id,
              admin: true
            }
          });
          await Notification.create({
            user_id: adminMember.user_id,
            message: `Post "${post.title}" reached ${like_count} likes`,
            link: "/"
          });
        }
        return res.json({ message: "Liked successfully!" });
      } else {
        await like.destroy();
        return res.json({ message: "Unliked successfully!" });
      }
    } catch (err) {
      next(err)
    }
  }

};
