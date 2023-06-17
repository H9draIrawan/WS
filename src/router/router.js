const express = require("express");
const router = express.Router();

const userRouter = require("./routerUser");
const invoiceRouter = require("./routerInvoice");
const itemRouter = require("../router/routerItem");

router.use("/users", userRouter);
router.use("/invoices", invoiceRouter);
router.use("/items", itemRouter);

module.exports = router;
