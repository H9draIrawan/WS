"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    static associate(models) {
      this.belongsTo(models.users);
    }
  }
  Transaction.init(
    {
      amount: DataTypes.INTEGER,
      payment_status: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "transactions",
      tableName: "transactions",
    }
  );
  return Transaction;
};
