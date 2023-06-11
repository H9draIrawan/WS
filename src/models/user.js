"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
    static associate(models) {
      this.hasMany(models.invoices);
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      saldo: DataTypes.INTEGER,
      apiHit: DataTypes.INTEGER,
      apiKey: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "users",
      tableName: "users",
    }
  );
  return User;
};
