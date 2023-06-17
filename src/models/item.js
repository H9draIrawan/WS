"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.invoices);
    }
  }
  Item.init(
    {
      name: DataTypes.STRING,
      qty: DataTypes.NUMBER,
      price: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "items",
      tableName: "items",
    }
  );
  return Item;
};
