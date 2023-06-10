const express = require("express");
const router = express.Router();

const {
  RegisterUser,
  LoginUser,
  TopupApihit,
  TopupSaldo,
  CekApihit,
  CekSaldo,
  CekToken,
  webhook,
} = require("../controller/controllerUser");

router.post("/register", RegisterUser);
router.post("/login", LoginUser);

router.get("/apihit", CekToken, CekApihit);
router.get("/saldo", CekToken, CekSaldo);

router.put("/saldo/topup", CekToken, TopupSaldo);
router.put("/apihit/topup", CekToken, TopupApihit);

router.post("/webhook", webhook);

module.exports = router;
