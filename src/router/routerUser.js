const express = require("express");
const router = express.Router();

const {
  RegisterUser,
  LoginUser,
  TopupApihit,
  TopupSaldo,
  CekApihit,
  CekSaldo,
  Webhook,
  cekAPILayer,
} = require("../controller/controllerUser");

router.post("/register", RegisterUser);
router.post("/login", LoginUser);

router.get("/apihit", CekApihit);
router.get("/saldo", CekSaldo);

router.put("/saldo/topup", TopupSaldo);
router.put("/apihit/topup", TopupApihit);

router.post("/webhook", Webhook);

router.get("/", cekAPILayer);

module.exports = router;
