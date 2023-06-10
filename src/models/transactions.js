"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Transactions extends Model {
    static associate(models) {
      // define association here
    }
  }
  Transactions.init(
    {
      id_transaction: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      user_id: DataTypes.STRING,
      amount: DataTypes.INTEGER,
      transaction_date: DataTypes.DATE,
      payment_status: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Transactions",
      freezeTableName: true,
      timestamps: true,
    }
  );
  return Transactions;
};
