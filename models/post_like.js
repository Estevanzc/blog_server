'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post_like extends Model {
    static associate(models) {
      Post_like.belongsTo(models.Post,{foreignKey: "post_id", as: "post"})
      Post_like.belongsTo(models.User,{foreignKey: "user_id", as: "user"})
    }
  }
  Post_like.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Post_like',
  });
  return Post_like;
};