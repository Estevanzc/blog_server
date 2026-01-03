'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Member_request extends Model {
    static associate(models) {
      Member_request.belongsTo(models.User, { foreignKey: 'user_id' });
      Member_request.belongsTo(models.Blog, { foreignKey: 'blog_id' });
    }
  }
  Member_request.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    blog_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Member_request',
  });
  return Member_request;
};