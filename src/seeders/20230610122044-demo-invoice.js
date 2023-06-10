"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("invoices", [
      {
        id: "invoice-0ezl2",
        name: "faktur penjualan peralatan dapur",
        address: "jl peralatan dapur",
        seller: "Teigan",
        customer: "albert",
        userId: "user-whlyw",
        createdAt: "2023-06-10 19:08:17",
        updatedAt: "2023-06-10 19:08:17",
      },
      {
        id: "invoice-okAd_",
        name: "faktur toko sayur",
        address: "jln. sayur segar",
        seller: "Teigan",
        customer: "edward",
        userId: "user-whlyw",
        createdAt: "2023-06-10 17:26:42",
        updatedAt: "2023-06-10 17:26:42",
      },
      {
        id: "invoice-r13xn",
        name: "faktur penjualan daging",
        address: "jl daging",
        seller: "Teigan",
        customer: "william",
        userId: "user-whlyw",
        createdAt: "2023-06-10 19:10:45",
        updatedAt: "2023-06-10 19:10:45",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("invoices", null, {});
  },
};
