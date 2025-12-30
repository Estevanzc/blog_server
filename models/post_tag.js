'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post_tag extends Model {
    static associate(models) {
      Post_tag.belongsTo(models.Post,{foreignKey: "post_id"})
      Post_tag.belongsTo(models.Tag,{foreignKey: "tag_id"})
    }
  }
  Post_tag.init({
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tag_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Post_tag',
  });
  return Post_tag;
};