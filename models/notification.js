'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
      Notification.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    }
  }
  Notification.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    link: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Notification',
  });
  return Notification;
};