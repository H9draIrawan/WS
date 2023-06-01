const express = require("express");
const router = express.Router();

const { RegisterUser } = require("../controller/controllerUser");

router.post("/register", RegisterUser);

module.exports = router;
