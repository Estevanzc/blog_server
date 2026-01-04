'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post_view extends Model {
    static associate(models) {
      Post_view.belongsTo(models.Post,{foreignKey: "post_id", as: "post"})
      Post_view.belongsTo(models.User,{foreignKey: "user_id", as: "user"})
    }
  }
  Post_view.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Post_view',
  });
  return Post_view;
};