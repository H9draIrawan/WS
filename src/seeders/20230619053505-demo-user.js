"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("users", [
      {
        id: "user-i8xYJ",
        name: "hendra",
        email: "h9dragstyle@gmail.com",
        password:
          "$2b$12$2UPclTdtUZHvL/Rp5ZQP.edpj5pajhATEzbkr6C76diYiNMFS4qMC",
        saldo: 4000,
        apiHit: 2,
        apiKey: "aIT0ObbpBa",
        createdAt: "2023-06-19 12:46:36",
        updatedAt: "2023-06-19 16:16:56",
      },
      {
        id: "user-iRo66",
        name: "hendra2",
        email: "hendra090502@gmail.com",
        password:
          "$2b$12$6EkrJ/td2Z6CUZTdQspOC.SFEOXUJX7YRp2bTM1ET0yPbSqUzosG6",
        saldo: 36000,
        apiHit: 16,
        apiKey: "HPyNGfZlcs",
        createdAt: "2023-06-19 13:51:04",
        updatedAt: "2023-06-19 16:16:39",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("users", null, {});
  },
};
