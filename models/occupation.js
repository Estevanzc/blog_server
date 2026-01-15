'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Occupation extends Model {
    static associate(models) {
      Occupation.hasMany(models.Users, { foreignKey: "occupation_id", as: "users" })
    }
  }
  Occupation.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Occupation',
  });
  return Occupation;
};