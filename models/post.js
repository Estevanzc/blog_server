'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      Post.belongsTo(models.Blog, { foreignKey: "blog_id", as: "blog" });
      Post.belongsTo(models.Member, { foreignKey: "member_id", as: "member" });
      Post.hasMany(models.Post_view, { foreignKey: "post_id", as: "views" });
      Post.hasMany(models.Post_content, { foreignKey: "post_id", as: "contents" });
      Post.hasMany(models.Post_like, { foreignKey: "post_id", as: "likes" });
      Post.hasMany(models.Comment, { foreignKey: "post_id", as: "comments" });

      Post.belongsToMany(models.Tag, {
        through: models.Post_tag,
        foreignKey: "post_id",
        otherKey: "tag_id",
        as: "tags"
      });
    }

  }
  Post.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: {
          args: [1, 100],
          msg: "Title must have length between 1 and 100"
        }
      }
    },
    subtitle: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: {
          args: [1, 100],
          msg: "Subtitle must have length between 1 and 100"
        }
      }
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        hasMinLength(value) {
          if (value.length < 20) {
            throw new Error("Summary must be at least 20 characters long");
          }
        },
      }
    },
    member_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    blog_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    banner: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};