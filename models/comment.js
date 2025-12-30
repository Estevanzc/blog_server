'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      Comment.belongsTo(models.User, {foreignKey: "user_id"})
      Comment.belongsTo(models.Post, {foreignKey: "post_id"})
    }
  }
  Comment.init({
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    user_id: DataTypes.INTEGER,
    post_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};