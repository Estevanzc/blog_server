'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Blog extends Model {
    static associate(models) {
      Blog.belongsTo(models.Category, {foreignKey: 'category_id'});
      Blog.hasMany(models.Follower, {foreignKey: 'blog_id'});
      Blog.hasMany(models.Member, {foreignKey: 'blog_id'});
      Blog.hasMany(models.Post, {foreignKey: 'blog_id'});
    }
  }
  Blog.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    photo: DataTypes.STRING,
    banner: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Blog',
  });
  return Blog;
};