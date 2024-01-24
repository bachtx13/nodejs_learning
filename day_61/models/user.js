"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Phone, {
        foreignKey: "user_id",
        as: "phones",
      });
      User.belongsTo(models.Group, {
        foreignKey: "group_id",
        as: "group",
      });
      User.belongsToMany(models.Course, {
        through: "users_courses",
        foreignKey: "user_id",
        as: "courses",
      });
      User.belongsTo(models.Provider, {
        foreignKey: "provider_id",
        as: "provider",
      });
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      fullname: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
      provider_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      createdAt: "created_at",
      updatedAt: "updated_at",

      // paranoid: true, //Kích hoạt xóa mềm
      // deletedAt: "deleted_at",
    },
  );
  return User;
};
