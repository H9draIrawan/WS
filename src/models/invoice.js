"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Invoice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.items);
      this.belongsTo(models.users);
    }
  }
  Invoice.init(
    {
      name: DataTypes.STRING,
      logo: DataTypes.STRING,
      seller: DataTypes.STRING,
      customer: DataTypes.STRING,
      address: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "invoices",
      tableName: "invoices",
    }
  );
  return Invoice;
};
