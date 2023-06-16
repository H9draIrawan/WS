const express = require("express");
const multer = require("multer");
const router = express.Router();

const {
  ListInvoices,
  GetSingleInvoice,
  CreateInvoice,
  UpdateInvoice,
  DeleteInvoice,
  PrintInvoice,
  HitInvoice,
} = require("../controller/controllerInvoice");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Tentukan direktori tujuan penyimpanan file
    cb(null, "src/database");
  },
  filename: function (req, file, cb) {
    // Tentukan nama file yang akan disimpan
    cb(null, Date.now() + "." + file.originalname.split(".").pop());
  },
});
const upload = multer({ storage: storage });

router.get("/", HitInvoice, ListInvoices);
router.get("/:invoiceId", HitInvoice, GetSingleInvoice);
router.get("/print/:invoiceId", HitInvoice, PrintInvoice);
router.post("", [HitInvoice, upload.single("LOGO")], CreateInvoice);
router.put("/:invoiceId", [HitInvoice, upload.single("LOGO")], UpdateInvoice);
router.delete("/:invoiceId", HitInvoice, DeleteInvoice);

module.exports = router;
