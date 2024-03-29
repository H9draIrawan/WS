"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("items", [
      {
        id: "item-0zase",
        name: "mie goreng",
        qty: 1,
        price: 17000,
        invoiceId: "invoice-10IM_",
        createdAt: "2023-06-19 16:10:22",
        updatedAt: "2023-06-19 16:10:22",
      },
      {
        id: "item-4Kr14",
        name: "roti bagel",
        qty: 4,
        price: 15000,
        invoiceId: "invoice-Ghd9a",
        createdAt: "2023-06-19 16:13:42",
        updatedAt: "2023-06-19 16:13:42",
      },
      {
        id: "item-9MTdj",
        name: "nila bakar",
        qty: 1,
        price: 20000,
        invoiceId: "invoice-10IM_",
        createdAt: "2023-06-19 16:10:22",
        updatedAt: "2023-06-19 16:10:22",
      },
      {
        id: "item-aAYxp",
        name: "tomat",
        qty: 20,
        price: 10000,
        invoiceId: "invoice-mKkdJ",
        createdAt: "2023-06-19 16:00:38",
        updatedAt: "2023-06-19 16:00:38",
      },
      {
        id: "item-bbZOX",
        name: "roti tawar",
        qty: 1,
        price: 20000,
        invoiceId: "invoice-Ghd9a",
        createdAt: "2023-06-19 16:13:42",
        updatedAt: "2023-06-19 16:13:42",
      },
      {
        id: "item-CA7Cj",
        name: "kambing",
        qty: 10,
        price: 20000,
        invoiceId: "invoice-hSgL9",
        createdAt: "2023-06-19 16:02:58",
        updatedAt: "2023-06-19 16:02:58",
      },
      {
        id: "item-cjMpw",
        name: "babi",
        qty: 10,
        price: 45000,
        invoiceId: "invoice-hSgL9",
        createdAt: "2023-06-19 16:02:58",
        updatedAt: "2023-06-19 16:02:58",
      },
      {
        id: "item-DHBMr",
        name: "sapi",
        qty: 5,
        price: 40000,
        invoiceId: "invoice-hSgL9",
        createdAt: "2023-06-19 16:02:58",
        updatedAt: "2023-06-19 16:02:58",
      },
      {
        id: "item-Fm92F",
        name: "sawi",
        qty: 5,
        price: 15000,
        invoiceId: "invoice-mKkdJ",
        createdAt: "2023-06-19 16:00:38",
        updatedAt: "2023-06-19 16:00:38",
      },
      {
        id: "item-hEkc1",
        name: "seledri",
        qty: 10,
        price: 14000,
        invoiceId: "invoice-mKkdJ",
        createdAt: "2023-06-19 16:00:38",
        updatedAt: "2023-06-19 16:00:38",
      },
      {
        id: "item-I7FAs",
        name: "ayam",
        qty: 5,
        price: 15000,
        invoiceId: "invoice-hSgL9",
        createdAt: "2023-06-19 16:02:58",
        updatedAt: "2023-06-19 16:02:58",
      },
      {
        id: "item-iLS10",
        name: "sendok",
        qty: 10,
        price: 5000,
        invoiceId: "invoice-W9dYG",
        createdAt: "2023-06-19 15:56:13",
        updatedAt: "2023-06-19 15:56:13",
      },
      {
        id: "item-Je8wB",
        name: "donat",
        qty: 3,
        price: 10000,
        invoiceId: "invoice-Ghd9a",
        createdAt: "2023-06-19 16:13:42",
        updatedAt: "2023-06-19 16:13:42",
      },
      {
        id: "item-juts5",
        name: "wajan",
        qty: 2,
        price: 25000,
        invoiceId: "invoice-W9dYG",
        createdAt: "2023-06-19 15:56:13",
        updatedAt: "2023-06-19 15:56:13",
      },
      {
        id: "item-kmvzs",
        name: "es teh",
        qty: 2,
        price: 5000,
        invoiceId: "invoice-10IM_",
        createdAt: "2023-06-19 16:10:22",
        updatedAt: "2023-06-19 16:10:22",
      },
      {
        id: "item-MiTro",
        name: "panci",
        qty: 2,
        price: 30000,
        invoiceId: "invoice-W9dYG",
        createdAt: "2023-06-19 15:56:13",
        updatedAt: "2023-06-19 15:56:13",
      },
      {
        id: "item-NVFxz",
        name: "nasi",
        qty: 4,
        price: 5000,
        invoiceId: "invoice-10IM_",
        createdAt: "2023-06-19 16:10:22",
        updatedAt: "2023-06-19 16:10:22",
      },
      {
        id: "item-Omy3I",
        name: "kue muffin",
        qty: 3,
        price: 22000,
        invoiceId: "invoice-Ghd9a",
        createdAt: "2023-06-19 16:13:42",
        updatedAt: "2023-06-19 16:15:49",
      },
      {
        id: "item-tCqYZ",
        name: "ikan",
        qty: 10,
        price: 17000,
        invoiceId: "invoice-hSgL9",
        createdAt: "2023-06-19 16:02:58",
        updatedAt: "2023-06-19 16:02:58",
      },
      {
        id: "item-t_EJK",
        name: "spatula",
        qty: 4,
        price: 10000,
        invoiceId: "invoice-W9dYG",
        createdAt: "2023-06-19 15:56:13",
        updatedAt: "2023-06-19 15:56:13",
      },
      {
        id: "item-vAAoh",
        name: "garpu",
        qty: 10,
        price: 5000,
        invoiceId: "invoice-W9dYG",
        createdAt: "2023-06-19 15:56:13",
        updatedAt: "2023-06-19 15:56:13",
      },
      {
        id: "item-wgsT9",
        name: "kangkung",
        qty: 10,
        price: 12000,
        invoiceId: "invoice-mKkdJ",
        createdAt: "2023-06-19 16:00:38",
        updatedAt: "2023-06-19 16:00:38",
      },
      {
        id: "item-y3js9",
        name: "ayam goreng",
        qty: 1,
        price: 25000,
        invoiceId: "invoice-10IM_",
        createdAt: "2023-06-19 16:10:22",
        updatedAt: "2023-06-19 16:10:22",
      },
      {
        id: "item-Yhdnu",
        name: "es jeruk",
        qty: 1,
        price: 8000,
        invoiceId: "invoice-10IM_",
        createdAt: "2023-06-19 16:10:22",
        updatedAt: "2023-06-19 16:10:22",
      },
      {
        id: "item-Y_sFy",
        name: "bayam",
        qty: 5,
        price: 30000,
        invoiceId: "invoice-mKkdJ",
        createdAt: "2023-06-19 16:00:38",
        updatedAt: "2023-06-19 16:00:38",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("items", null, {});
  },
};
