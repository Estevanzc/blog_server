'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post_tag extends Model {
    static associate(models) {
    }
  }
  Post_tag.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Post_tag',
  });
  return Post_tag;
};