"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
    static associate(models) {
      // define association here
    }
  }
  user.init(
    {
      user_id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
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
      freezeTableName: true,
    }
  );
  return user;
};
