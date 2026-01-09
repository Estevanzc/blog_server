'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      Comment.belongsTo(models.User, { foreignKey: "user_id", as: "user" })
      Comment.belongsTo(models.Post, { foreignKey: "post_id", as: "post" })
    }
  }
  Comment.init({
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        hasMinLength(value) {
          if (value.length < 3) {
            throw new Error("Comment must be at least 3 characters long");
          }
        },
      }
    },
    user_id: DataTypes.INTEGER,
    post_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};