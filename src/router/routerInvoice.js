const express = require("express");
const multer = require("multer");
const path = require("path");

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

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     // Tentukan direktori tujuan penyimpanan file
//     cb(null, "src/database");
//   },
//   filename: function (req, file, cb) {
//     // Tentukan nama file yang akan disimpan
//     cb(null, Date.now() + "." + file.originalname.split(".").pop());
//   },
// });
// const upload = multer({ storage: storage });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/database");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = path.extname(file.originalname);
    const fileName = `${file.fieldname}-${uniqueSuffix}${extension}`;
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
    cb(null, true);
  } else {
    console.log(file.mimetype);
    cb(new Error("Only .png and .jpg format allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
});

router.get("/", HitInvoice, ListInvoices);
router.get("/:invoiceId", HitInvoice, GetSingleInvoice);
router.get("/print/:invoiceId/:template", HitInvoice, PrintInvoice);
router.post("/", [
  HitInvoice,
  upload.single("LOGO"),
  CreateInvoice,
  function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: err.message });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  },
]);
router.put("/:invoiceId", [HitInvoice, upload.single("LOGO")], UpdateInvoice);
router.delete("/:invoiceId", HitInvoice, DeleteInvoice);

module.exports = router;
