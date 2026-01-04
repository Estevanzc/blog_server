const controller = require('./controller');
const tagController = require('./tagController');
const { sequelize, Blog, Member, Category, User, Comment, Follower, Member_request, Notification, Post_content, Post_like, Post_view, Post_tag, Tag, Post, Preference } = require('../../models');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const uploadConfig = require('../config/update');
const upload = multer(uploadConfig);
const fs = require('fs/promises');
const path = require('path');
const { Op, Sequelize, where } = require('sequelize');
const UPLOAD_ROOT = path.resolve(process.cwd(), "uploads");

module.exports = {
  async destroyContent(post_id, transaction = null) {
    const contents = await Post_content.findAll({
      where: { post_id: post_id },
      attributes: ["id", "type", "content"],
      transaction
    });
    for (const content of contents) {
      if (content.type !== 3 || !content.content) continue;
      try {
        const relativePath = content.content.replace(/^\/uploads\//, "");
        const absolutePath = path.join(UPLOAD_ROOT, relativePath);
        if (!absolutePath.startsWith(UPLOAD_ROOT)) continue;
        await fs.unlink(absolutePath);
      } catch (err) {
        if (err.code !== "ENOENT") {
          console.error("Failed to delete image:", err);
          throw err;
        }
      }
    }
    await Post_content.destroy({
      where: { post_id: post_id },
      transaction
    });
  }
};
