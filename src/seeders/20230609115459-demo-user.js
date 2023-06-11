"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("users", [
      {
        id: "user-6Yynh",
        name: "Nino",
        email: "nino@gmail.com",
        password:
          "$2b$12$hqtgWFoaZUkPVxQ6GFOHHe5FbFJ1Je3rbvK.v63DirVLHxrl.SaCK",
        saldo: 0,
        apiHit: 0,
        apiKey: "5Hgx3BvnKC",
        createdAt: "2023-06-09 19:44:59",
        updatedAt: "2023-06-09 19:44:59",
      },
      {
        id: "user-AvX_n",
        name: "Silvie",
        email: "silvie@gmail.com",
        password:
          "$2b$12$c1J/quHGxOFnQsjNCEVg7uZglgCdaBNJWLj0dtMz5nG8sRPUdCB0m",
        saldo: 0,
        apiHit: 0,
        apiKey: "aPxG3Yaltn",
        createdAt: "2023-06-09 19:44:07",
        updatedAt: "2023-06-09 19:44:07",
      },
      {
        id: "user-CqydN",
        name: "Rahmah",
        email: "rahmah@gmail.com",
        password:
          "$2b$12$o8Hs4WFODnaCHGK8FuRO5.H3ztd8zeG0Yj.xziQPKo0QrVQAB0zgS",
        saldo: 0,
        apiHit: 0,
        apiKey: "kGor2ozCS6",
        createdAt: "2023-06-09 19:42:48",
        updatedAt: "2023-06-09 19:42:48",
      },
      {
        id: "user-d-_xT",
        name: "Annalise",
        email: "annalise@gmail.com",
        password:
          "$2b$12$N7joTPHWtxQ/A33cN0s6OucNu78g2dvaatU4S4.hE7lPyNbrMm6eO",
        saldo: 0,
        apiHit: 0,
        apiKey: "yrgTCdnKqy",
        createdAt: "2023-06-09 19:38:57",
        updatedAt: "2023-06-09 19:38:57",
      },
      {
        id: "user-LS49E",
        name: "Akbar",
        email: "akbar@gmail.com",
        password:
          "$2b$12$OKqg29lMSp8pT2F6bXS1iO6EpSTmGhP/sUTW5cvIcfgRkcrFfnih2",
        saldo: 0,
        apiHit: 0,
        apiKey: "usUN62cWwT",
        createdAt: "2023-06-09 19:42:12",
        updatedAt: "2023-06-09 19:42:12",
      },
      {
        id: "user-oPToY",
        name: "Knyla",
        email: "knyla@gmail.com",
        password:
          "$2b$12$0n9Ih./vDOJmUgdOx/AR2.fxXblddY13A3Xllmy7VKBukprSVukSy",
        saldo: 0,
        apiHit: 0,
        apiKey: "i5k-eW0H_x",
        createdAt: "2023-06-09 19:37:03",
        updatedAt: "2023-06-09 19:37:03",
      },
      {
        id: "user-Sfeqv",
        name: "Khalise",
        email: "khalise@gmail.com",
        password:
          "$2b$12$GGr7Es/.jXeGmQjQt7KgfO1mVZXbTHT2KEYC03nlcmggSXNW2/CHa",
        saldo: 0,
        apiHit: 0,
        apiKey: "AEKJYUy-6O",
        createdAt: "2023-06-09 19:38:12",
        updatedAt: "2023-06-09 19:38:12",
      },
      {
        id: "user-sFs7m",
        name: "Porter",
        email: "porter@gmail.com",
        password:
          "$2b$12$m2khVRU2QsWQT72Y4LIJg.lTflq1hSqEEUsBSJ0bZILe1feVFC5X6",
        saldo: 0,
        apiHit: 0,
        apiKey: "PUbMwOrgQ4",
        createdAt: "2023-06-09 19:37:44",
        updatedAt: "2023-06-09 19:37:44",
      },
      {
        id: "user-UFnyk",
        name: "Addieson",
        email: "addieson@gmail.com",
        password:
          "$2b$12$.vu1W0LXBRvhmAkYnMLkcOnMZaJn8UX7AGl32P79El7m9vd66Wo/6",
        saldo: 0,
        apiHit: 0,
        apiKey: "BoHOWShM9M",
        createdAt: "2023-06-09 19:43:17",
        updatedAt: "2023-06-09 19:43:17",
      },
      {
        id: "user-whlyw",
        name: "Teigan",
        email: "teigan@gmail.com",
        password:
          "$2b$12$SGQd/7eZA2vlIsCjBuGjE.UkBEFNeiyCNpFaMIob3d4GJt52p1EKW",
        saldo: 0,
        apiHit: 0,
        apiKey: "3pzOjOKAnb",
        createdAt: "2023-06-09 19:36:31",
        updatedAt: "2023-06-09 19:36:31",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("users", null, {});
  },
};
