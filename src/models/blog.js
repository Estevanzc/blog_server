'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Blog extends Model {
    static associate(models) {
    }
  }
  Blog.init({
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    subname: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
    },
    photo: {
      type: DataTypes.STRING(255),
    },
    banner: {
      type: DataTypes.STRING(255),
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Blog',
  });
  return Blog;
};