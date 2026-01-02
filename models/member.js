'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Member extends Model {
    static associate(models) {
      Member.belongsTo(models.Blog, {
        foreignKey: "blog_id",
        as: "blog"
      })
      Member.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user"
      })
      Member.hasMany(models.Post, {
        foreignKey: "member_id",
        as: "posts"
      })
    }
  }
  Member.init({
    role: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
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
    modelName: 'Member',
  });
  return Member;
};