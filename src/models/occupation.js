'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Occupation extends Model {
    static associate(models) {
    }
  }
  Occupation.init({
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Occupation',
  });
  return Occupation;
};