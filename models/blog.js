'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Blog extends Model {
    static associate(models) {
      Blog.belongsTo(models.Category, {foreignKey: 'category_id', as: 'category'});
      Blog.hasMany(models.Follower, {foreignKey: 'blog_id', as: 'followers'});
      Blog.hasMany(models.Member, {foreignKey: 'blog_id', as: 'members'});
      Blog.hasMany(models.Post, {foreignKey: 'blog_id', as: 'posts'});
      Blog.hasMany(models.Member_request, {foreignKey: "blog_id", as: "requests"})
    }
  }
  Blog.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: {
          args: [1, 100],
          msg: "Name must have length between 1 and 100"
        }
      }
    },
    subname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: {
          args: [1, 100],
          msg: "Subname must have length between 1 and 100"
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        hasMinLength(value) {
          if (value.length < 10) {
            throw new Error("Description must be at least 10 characters long");
          }
        },
      }
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