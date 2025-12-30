'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Follower extends Model {
    static associate(models) {
      Follower.belongsTo(models.Blog, { foreignKey: "blog_id" })
      Follower.belongsTo(models.User, { foreignKey: "user_id" })
    }
  }
  Follower.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    blog_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Follower',
  });
  return Follower;
};