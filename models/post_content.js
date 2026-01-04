'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post_content extends Model {
    static associate(models) {
      Post_content.belongsTo(models.Post, {foreignKey: "post_id", as: "post"});
    }
  }
  Post_content.init({
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.INTEGER, // 1: title, 2: text, 3: image, 4:citation
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Post_content',
  });
  return Post_content;
};