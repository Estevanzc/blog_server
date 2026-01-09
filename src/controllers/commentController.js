const controller = require('./controller');
const { sequelize, Blog, Member, Category, User, Comment, Follower, Member_request, Notification, Post_content, Post_like, Post_view, Post_tag, Tag, Post, Preference } = require('../../models');
const { Sequelize } = require('sequelize');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const uploadConfig = require('../config/update');
const upload = multer(uploadConfig);
const fs = require('fs/promises');
const path = require('path');

module.exports = {
  async store(req, res, next) {
    try {
      let user_id = req.user.id
      let { content, post_id } = req.body
      let post = await Post.findByPk(post_id)
      if (!post) {
        return res.status(404).json({
          error: "Post not found"
        })
      }
      let comment = await Comment.create({
        content: content,
        user_id: user_id,
        post_id: post_id,
      })
      return res.status(201).json({
        message: "Comment created successfully"
      })
    } catch (err) {
      next(err);
    }
  },
  async update(req, res, next) {
    try {
      let user_id = req.user.id
      let { content, id } = req.body
      let comment = await Comment.findByPk(id)
      if (!comment) {
        return res.status(404).json({
          error: "Comment not found"
        })
      }
      if (comment.user_id != user_id) {
        return res.status(403).json({
          error: "Current logged user is not the owner of the comment"
        })
      }
      await comment.update({
        content
      })
      return res.status(200).json({
        message: "Comment updated successfully"
      })
    } catch (err) {
      next(err);
    }
  },
  async destroy(req, res, next) {
    try {
      let user_id = req.user.id
      let { id } = req.params;
      let comment = await Comment.findByPk(id);
      if (!comment) {
        return res.status(404).json({
          error: 'Comment not found'
        });
      }
      if (comment.user_id !== user_id && !req.user.admin) {
        return res.status(403).json({
          error: 'Access denied'
        });
      }
      await comment.destroy()
      return res.json({ message: "Comment deleted successfully" })
    } catch (err) {
      next(err)
    }
  },
};
