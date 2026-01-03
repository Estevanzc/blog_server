'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    static associate(models) {
      Tag.hasMany(models.Post_tag, { foreignKey: "tag_id", as: "post_tags" });
      Tag.belongsToMany(models.Post, {
        through: models.Post_tag,
        foreignKey: "tag_id",
        otherKey: "post_id",
        as: "posts"
      });
    }
  }
  Tag.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    }
  }, {
    sequelize,
    modelName: 'Tag',
  });
  return Tag;
};