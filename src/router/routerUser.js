const express = require("express");
const router = express.Router();

const { RegisterUser, LoginUser } = require("../controller/controllerUser");

router.post("/register", RegisterUser);
router.post("/login", LoginUser);

module.exports = router;
