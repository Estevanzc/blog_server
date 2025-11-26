'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
    }
  }
  Post.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};