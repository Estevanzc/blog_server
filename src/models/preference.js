'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Preference extends Model {
    static associate(models) {
    }
  }
  Preference.init({
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Preference',
  });
  return Preference;
};