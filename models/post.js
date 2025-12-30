'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      Post.belongsTo(models.Blog, {
        foreignKey: "blog_id"
      })
      Post.belongsTo(models.Member, {
        foreignKey: "member_id"
      })
      Post.hasMany(models.Post_view, {foreignKey:"post_id"})
      Post.hasMany(models.Post_tag, {foreignKey:"post_id"})
      Post.hasMany(models.Post_content, {foreignKey:"post_id"})
      Post.hasMany(models.Post_like, {foreignKey:"post_id"})
      Post.hasMany(models.Comment, {foreignKey:"post_id"})
    }
  }
  Post.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subtitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    member_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    blog_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    banner: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};