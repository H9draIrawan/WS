const express = require("express");
const router = express.Router();
const {
  ListInvoices,
  GetSingleInvoice,
  CreateInvoice,
  UpdateInvoice,
  DeleteInvoice,
  HitInvoice
} = require("../controller/controllerInvoice");

router.post("/create",HitInvoice, CreateInvoice);

module.exports = router;
