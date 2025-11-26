'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post_like extends Model {
    static associate(models) {
    }
  }
  Post_like.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Post_like',
  });
  return Post_like;
};