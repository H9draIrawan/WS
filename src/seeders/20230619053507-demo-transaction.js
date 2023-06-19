"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("transactions", [
      {
        id: "order-1962023-87956",
        amount: 100000,
        payment_status: 1,
        userId: "user-i8xYJ",
        createdAt: "2023-06-19 12:47:27",
        updatedAt: "2023-06-19 12:56:45",
      },
      {
        id: "order-1962023-96807",
        amount: 100000,
        payment_status: 1,
        userId: "user-iRo66",
        createdAt: "2023-06-19 13:51:47",
        updatedAt: "2023-06-19 13:52:48",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("transactions", null, {});
  },
};
