'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User_search extends Model {
    static associate(models) {
      User_search.belongsTo(models.User, {foreignKey: "user_id", as: "user"})
    }
  }
  User_search.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'User_search',
  });
  return User_search;
};