const express = require("express");
const router = express.Router();

const {
  Additem,
  Updateitem,
  Deleteitem,
  HitItem,
} = require("../controller/controllerItem");

router.post("/:invoiceId", HitItem, Additem);
router.put("/:invoiceId", HitItem, Updateitem);
router.delete("/:invoiceId", HitItem, Deleteitem);

module.exports = router;
