'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Occupation extends Model {
    static associate(models) {
      Occupation.hasMany(models.User, { foreignKey: "occupation_id", as: "users" })
    }
  }
  Occupation.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: {
          args: [3, 254],
          msg: "Name must have length between 3 and 254"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Occupation',
  });
  return Occupation;
};