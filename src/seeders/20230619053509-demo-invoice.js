"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("invoices", [
      {
        id: "invoice-10IM_",
        name: "restorant enak sekali",
        logo: "src\\database\\1687165683339.jpg",
        address: "swayalan mall",
        seller: "hendra2",
        customer: "jeni",
        userId: "user-iRo66",
        createdAt: "2023-06-19 16:08:03",
        updatedAt: "2023-06-19 16:08:03",
      },
      {
        id: "invoice-Ghd9a",
        name: "toko roti",
        logo: "src\\database\\1687165602234.jpg",
        address: "swayalan mall",
        seller: "hendra2",
        customer: "dani",
        userId: "user-iRo66",
        createdAt: "2023-06-19 16:06:42",
        updatedAt: "2023-06-19 16:06:42",
      },
      {
        id: "invoice-hSgL9",
        name: "toko daging",
        logo: "src\\database\\1687156286618.jpg",
        address: "swalayan mall",
        seller: "hendra",
        customer: "mike",
        userId: "user-i8xYJ",
        createdAt: "2023-06-19 13:02:15",
        updatedAt: "2023-06-19 13:31:26",
      },
      {
        id: "invoice-mKkdJ",
        name: "toko sayur",
        logo: "src\\database\\1687157131270.jpg",
        address: "swalayan mall",
        seller: "hendra",
        customer: "finna",
        userId: "user-i8xYJ",
        createdAt: "2023-06-19 13:45:31",
        updatedAt: "2023-06-19 13:45:31",
      },
      {
        id: "invoice-W9dYG",
        name: "toko peralatan dapur",
        logo: "src\\database\\1687157184086.png",
        address: "swalayan mall",
        seller: "hendra",
        customer: "betty",
        userId: "user-i8xYJ",
        createdAt: "2023-06-19 13:46:24",
        updatedAt: "2023-06-19 13:46:24",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("invoices", null, {});
  },
};
