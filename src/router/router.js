const express = require("express");
const router = express.Router();

const invoiceRouter = require("./routerInvoice");
const userRouter = require("./routerUser");

router.use("/invoice", invoiceRouter);
router.use("/users", userRouter);

module.exports = router;
