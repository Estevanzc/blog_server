'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Preference, {foreignKey: "user_id", as: "preferences"})
      User.hasMany(models.Follower, {foreignKey: "user_id", as: "followers"})
      User.hasMany(models.Member, {foreignKey: "user_id", as: "members"})
      User.hasMany(models.Post_view, {foreignKey: "user_id", as: "views"})
      User.hasMany(models.Post_like, {foreignKey: "user_id", as: "likes"})
      User.hasMany(models.Member_request, {foreignKey: "user_id", as: "requests"})
      User.hasMany(models.Notification, { foreignKey: 'user_id', as: 'notifications' });
      User.hasMany(models.Comment, { foreignKey: 'user_id', as: 'comments' });
    }
  }
  User.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 100]
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        len: [3, 254]
      }
    },
    password: DataTypes.STRING,
    birth: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    dark_mode: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    photo: {
      type: DataTypes.STRING,
    },
    banner: {
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};