'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Preference extends Model {
    static associate(models) {
      Preference.belongsTo(models.User, {foreignKey:"user_id", as:"user"})
    }
  }
  Preference.init({
    keyword: {
      type: DataTypes.STRING,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Preference',
  });
  return Preference;
};