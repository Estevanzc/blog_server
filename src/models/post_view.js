'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post_view extends Model {
    static associate(models) {
    }
  }
  Post_view.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Post_view',
  });
  return Post_view;
};