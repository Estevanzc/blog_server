'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Preference, { foreignKey: "user_id", as: "preferences" })
      User.hasMany(models.Follower, { foreignKey: "user_id", as: "followers" })
      User.hasMany(models.Member, { foreignKey: "user_id", as: "members" })
      User.hasMany(models.Post_view, { foreignKey: "user_id", as: "views" })
      User.hasMany(models.Post_like, { foreignKey: "user_id", as: "likes" })
      User.hasMany(models.Member_request, { foreignKey: "user_id", as: "requests" })
      User.hasMany(models.Notification, { foreignKey: 'user_id', as: 'notifications' });
      User.hasMany(models.Comment, { foreignKey: 'user_id', as: 'comments' });
      User.hasMany(models.User_search, { foreignKey: 'user_id', as: 'searches' });
    }
  }
  User.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: {
          args: [1, 100],
          msg: "Name must have length between 1 and 100"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        len: {
          args: [3, 254],
          msg: "Email must have length between 3 and 254"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        hasMinLength(value) {
          if (value.length < 3) {
            throw new Error("Password must be at least 3 characters long");
          }
        },
        hasNumber(value) {
          if (!/\d/.test(value)) {
            throw new Error("Password must contain at least one number");
          }
        }
      }
    },
    birth: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true,
        notInFuture(value) {
          const today = new Date();
          const inputDate = new Date(value);
          today.setHours(0, 0, 0, 0);
          if (inputDate > today) {
            throw new Error("Date cannot be in the future");
          }
        }
      },
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