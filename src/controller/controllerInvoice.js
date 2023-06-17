const axios = require("axios");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const Nanoid = require("nanoid");
const PDFDocument = require("pdfkit-table");
const fs = require("fs");
const db = require("../models/index");
const { Model } = require("sequelize");

async function HitInvoice(req, res, next) {
  const CekToken = Joi.string().empty().required().messages({
    "any.required": "x-auth-token is a required field",
    "string.empty": "x-auth-token cannot be an empty field",
  });
  const CekApiKey = Joi.string().empty().required().messages({
    "any.required": "x-api-key is a required field",
    "string.empty": "x-api-key cannot be an empty field",
  });
  try {
    await CekToken.validateAsync(req.header("x-auth-token"));
    await CekApiKey.validateAsync(req.header("x-api-key"));
  } catch (err) {
    return res.status(400).send({ message: err });
  }

  try {
    const checking = jwt.verify(
      req.header("x-auth-token"),
      process.env.JWT_Secret_Key
    );
  } catch (err) {
    return res.status(400).send({ message: "Invalid JWT Token" });
  }

  const apiKey = req.header("x-api-key");
  const User = await db.users.findOne({
    where: {
      apiKey,
    },
  });

  if (!User) return res.status(404).send({ message: "x-api-key not found" });
  if (User.apiHit <= 0)
    return res.status(404).send({ message: "apiHit not enough" });

  req.user = User.id;
  next();
}

async function generateIDInvoice() {
  const id = "invoice-" + Nanoid.nanoid(5);
  const check = await db.invoices.findOne({
    where: {
      id,
    },
  });

  if (check) {
    generateIDInvoice();
  } else {
    return id;
  }
}

const ListInvoices = async (req, res) => {
  const Invoice = await db.invoices.findAll({
    include: [
      {
        model: db.items,
        attributes: ["id", "name", "qty", "price"],
      },
    ],
  });
  let data = [];
  Invoice.forEach((element) => {
    data.push({
      id: element.id,
      date: element.createdAt.toLocaleDateString("en-GB"),
      name: element.name,
      seller: element.seller,
      customer: element.customer,
      address: element.address,
      items: element.items,
    });
  });
  const User = await db.users.findByPk(req.user);
  User.apiHit--;
  User.updatedAt = new Date();
  User.save();
  return res.status(200).send(data);
};
const GetSingleInvoice = async (req, res) => {
  const Invoice = await db.invoices.findByPk(req.params.invoiceId, {
    include: [
      {
        model: db.items,
        attributes: ["id", "name", "qty", "price"],
      },
    ],
  });
  if (!Invoice)
    return res.status(404).send({ message: "Invoice is not found" });
  const User = await db.users.findByPk(req.user);
  User.apiHit--;
  User.save();
  return res.status(200).send({
    id: Invoice.id,
    date: Invoice.createdAt.toLocaleDateString("en-GB"),
    name: Invoice.name,
    seller: Invoice.seller,
    customer: Invoice.customer,
    address: Invoice.address,
    items: Invoice.items,
  });
};
const CreateInvoice = async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().empty().required().messages({
      "any.required": "name is a required field",
      "string.empty": "name cannot be an empty field",
    }),
    address: Joi.string().empty().required().messages({
      "any.required": "address is a required field",
      "string.empty": "address cannot be an empty field",
    }),
    customer: Joi.string().empty().required().messages({
      "any.required": "customer is a required field",
      "string.empty": "customer cannot be an empty field",
    }),
  });

  try {
    await schema.validateAsync(req.body);
  } catch (err) {
    return res.status(400).send({ message: err.message });
  }
  const { name, address, customer } = req.body;
  const id = await generateIDInvoice();
  const userId = req.user;
  const User = await db.users.findByPk(req.user);

  await db.invoices.create({
    id,
    name,
    logo: req.file.path,
    address,
    seller: User.name,
    customer,
    userId,
  });

  User.apiHit--;
  User.updatedAt = new Date();
  User.save();

  return res.status(201).send({
    message: "Invoice template has been created",
    invoice: id,
  });
};
const UpdateInvoice = async (req, res) => {
  const id = req.params.invoiceId;
  const schema = Joi.object({
    name: Joi.string().empty().required().messages({
      "any.required": "name is a required field",
      "string.empty": "name cannot be an empty field",
    }),
    address: Joi.string().empty().required().messages({
      "any.required": "address is a required field",
      "string.empty": "address cannot be an empty field",
    }),
    customer: Joi.string().empty().required().messages({
      "any.required": "customer is a required field",
      "string.empty": "customer cannot be an empty field",
    }),
  });

  try {
    await schema.validateAsync(req.body);
  } catch (err) {
    return res.status(400).send({ message: err.message });
  }
  const { name, address, customer } = req.body;

  const User = await db.users.findByPk(req.user);
  const Invoice = await db.invoices.findByPk(id);

  if (!Invoice)
    return res.status(404).send({ message: "Invoice is not found" });

  const filePath = Invoice.logo;
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
      return;
    }
    console.log("File deleted successfully.");
  });

  Invoice.name = name;
  Invoice.address = address;
  Invoice.customer = customer;
  Invoice.logo = req.file.path;
  Invoice.updatedAt = new Date();
  Invoice.save();

  User.apiHit--;
  User.updatedAt = new Date();
  User.save();

  return res.status(201).send({
    message: "Invoice has been updated",
    name: name,
    address: address,
    customer: customer,
  });
};
const DeleteInvoice = async (req, res) => {
  const id = req.params.invoiceId;
  const Invoice = await db.invoices.findByPk(id);
  if (!Invoice)
    return res.status(404).send({ message: "Invoice is not found" });

  const filePath = Invoice.logo;
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
      return;
    }
    console.log("File deleted successfully.");
  });

  await db.invoices.destroy({
    where: {
      id,
    },
  });

  const User = await db.users.findByPk(req.user);
  User.apiHit--;
  User.updatedAt = new Date();
  User.save();

  return res.status(200).send({ message: "Invoice has been deleted" });
};
const PrintInvoice = async (req, res) => {
  const Invoice = await db.invoices.findByPk(req.params.invoiceId);
  if (!Invoice)
    return res.status(404).send({ message: "Invoice is not found" });

  const Item = await db.items.findAll({
    where: {
      invoiceId: Invoice.id,
    },
  });

  const table = {
    headers: [
      {
        label: "No",
        property: "No",
        width: 30,
        headerColor: "#0000FF",
        headerOpacity: 0.5,
        align: "center",
        renderer: null,
      },
      {
        label: "Kode Barang",
        property: "Kode",
        width: 90,
        headerColor: "#0000FF",
        headerOpacity: 0.5,
        align: "left",
        renderer: null,
      },
      {
        label: "Nama Barang",
        property: "Barang",
        width: 120,
        headerColor: "#0000FF",
        headerOpacity: 0.5,
        align: "left",
        renderer: null,
      },
      {
        label: "Qty",
        property: "Qty",
        width: 40,
        headerColor: "#0000FF",
        headerOpacity: 0.5,
        align: "center",
        renderer: null,
      },
      {
        label: "Harga",
        property: "Harga",
        width: 100,
        headerColor: "#0000FF",
        headerOpacity: 0.5,
        align: "center",
        renderer: (value) => `Rp ${Number(value).toFixed(2)}`,
      },
      {
        label: "Subtotal",
        property: "Subtotal",
        width: 100,
        headerColor: "#0000FF",
        headerOpacity: 0.5,
        align: "center",
        renderer: (value) => `Rp ${Number(value).toFixed(2)}`,
      },
    ],
    rows: [],
  };
  const tabletotal = {
    headers: [
      {
        label: "Blank",
        property: "Blank",
        width: 280,
        align: "right",
        renderer: null,
      },
      {
        label: "Total",
        property: "Total",
        width: 100,
        align: "center",
        renderer: null,
      },
      {
        label: "Value",
        property: "Value",
        width: 100,
        align: "center",
        renderer: (value) => `Rp ${Number(value).toFixed(2)}`,
      },
    ],
    rows: [],
  };

  let Amount = 0;
  Item.forEach((element, idx) => {
    const newRow = [
      idx + 1,
      element.id,
      element.name,
      element.qty,
      element.price,
      element.qty * element.price,
    ];
    table.rows.push(newRow);
    Amount += element.qty * element.price;
  });

  const url = `https://api.apilayer.com/tax_data/price?amount=${Amount}&country=ID`;
  const headers = {
    apikey: process.env.APILayerTax,
  };
  let { PPn, Result } = 0;
  await axios
    .get(url, { headers })
    .then((response) => {
      PPn = response.data.price_excl_vat * response.data.vat_rate;
      Result = response.data.price_incl_vat;
    })
    .catch((error) => {
      console.error(error);
    });

  tabletotal.rows.push(["", "PPn 11 %", PPn]);
  tabletotal.rows.push(["", "Total", Result]);

  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream("Invoice.pdf"));
  doc.save();
  doc.circle(450, 130, 100).clip();
  doc.image(Invoice.logo, 350, 30, {
    width: 200,
    height: 200,
  });
  doc.restore();
  doc.font("Helvetica-Bold").fontSize(20).text(Invoice.name).moveDown(3);
  doc.fontSize(10).text(`Invoice   : ${Invoice.id}`);
  doc
    .fontSize(10)
    .text(`Tanggal  : ${Invoice.createdAt.toLocaleDateString("en-GB")}`);
  doc.fontSize(10).text(`Address : ${Invoice.address}`);
  doc.fontSize(10).text(`Sales      : ${Invoice.seller}`).moveDown(1);

  doc.table(table, {
    title: {
      label: "FAKTUR PENJUALAN",
      fontSize: 15,
    },
    divider: {
      header: { disabled: false, width: 2, opacity: 1 },
      horizontal: { disabled: false, width: 1, opacity: 0.5 },
    },
    columnSpacing: 5,
    minRowHeight: 0,
    prepareHeader: () => doc.font("Helvetica-Bold").fontSize(12),
    prepareRow: () => doc.font("Helvetica").fontSize(10),
  });

  doc.table(tabletotal, {
    divider: {
      header: { disabled: false, width: 2, opacity: 1 },
      horizontal: { disabled: false, width: 1, opacity: 0.5 },
    },
    columnSpacing: 5,
    hideHeader: true,
    prepareRow: () => doc.font("Helvetica-Bold").fontSize(10),
  });

  doc.pipe(res);
  doc.end();
  const User = await db.users.findByPk(req.user);
  User.apiHit--;
  User.updatedAt = new Date();
  User.save();
};

module.exports = {
  ListInvoices,
  GetSingleInvoice,
  CreateInvoice,
  UpdateInvoice,
  DeleteInvoice,
  PrintInvoice,
  HitInvoice,
};
