const axios = require("axios");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const Nanoid = require("nanoid");
const PDFDocument = require("pdfkit-table");
const fs = require("fs");
const db = require("../models/index");

const pdfkit = require("pdfkit");

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

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

async function generateIDInvoice() {
  const id = "INV-" + Nanoid.nanoid(5);
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

async function templateInvoice1(id_invoice) {
  const Invoice = await db.invoices.findByPk(id_invoice, {
    include: [
      {
        model: db.items,
        attributes: ["id", "name", "qty", "price"],
      },
    ],
  });

  // let img = "";

  // if (Invoice.logo) {
  //   const ext = Invoice.logo.split(".").pop();
  //   img = "data:image/" + ext + ";base64," + Invoice.logo;
  // }

  let img = Invoice.logo;

  let doc = new pdfkit({ size: "A4", margin: 50 });
  doc.fontSize(15);

  doc.image(img, 50, 45, { width: 50 });

  doc
    .fillColor("#444444")
    .fontSize(20)
    .text(Invoice.name, 110, 57)
    .fontSize(10)
    // .text("Institut Sains dan Teknologi Terpadu Surabaya", 200, 60, {
    //   align: "right",
    // })
    .text(Invoice.address, 200, 80, { align: "right" })
    .moveDown();

  doc.fillColor("#444444").fontSize(20).text("INVOICE", 50, 130);

  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, 155)
    .lineTo(550, 155)
    .stroke();

  doc.fillColor("#444444").fontSize(10).text("Invoice Number:", 50, 165);
  // doc.fillColor("#444444").fontSize(10).text("INV-001", 150, 165);
  doc.fillColor("#444444").fontSize(10).text(Invoice.id, 150, 165);

  doc.fillColor("#444444").fontSize(10).text("Invoice Date:", 50, 180);
  // doc.fillColor("#444444").fontSize(10).text("21/06/2023", 150, 180);
  let created_at_date_only = Invoice.createdAt.toISOString().split("T")[0];
  doc.fillColor("#444444").fontSize(10).text(created_at_date_only, 150, 180);

  doc.fillColor("#444444").fontSize(10).text("Balance Due:", 50, 195);
  // doc.fillColor("#444444").fontSize(10).text("Rp. 250.000", 150, 195);
  doc.fillColor("#444444").fontSize(10).text(Invoice.total, 150, 195);

  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(350, 155)
    .lineTo(550, 155)
    .stroke();

  let getUser = await db.users.findByPk(Invoice.userId);

  // doc.fillColor("#444444").fontSize(10).text("John Doe", 280, 165, {
  //   align: "left",
  // });
  doc.fillColor("#444444").fontSize(10).text(getUser.name, 280, 165, {
    align: "left",
  });

  // doc.fillColor("#444444").fontSize(10).text("johndoe@gmail.com", 280, 180, {
  //   align: "left",
  // });
  doc.fillColor("#444444").fontSize(10).text(getUser.email, 280, 180, {
    align: "left",
  });

  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, 215)
    .lineTo(550, 215)
    .stroke();

  doc.fillColor("#444444").fontSize(10).text("No", 50, 225);
  doc.fillColor("#444444").fontSize(10).text("Nama Barang", 100, 225);
  doc.fillColor("#444444").fontSize(10).text("Quantity", 280, 225);
  doc.fillColor("#444444").fontSize(10).text("Harga", 380, 225);
  doc.fillColor("#444444").fontSize(10).text("Subtotal", 480, 225);

  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, 240)
    .lineTo(550, 240)
    .stroke();

  // doc.fillColor("#444444").fontSize(10).text("1", 50, 250);
  // doc.fillColor("#444444").fontSize(10).text("Kursi", 100, 250);
  // doc.fillColor("#444444").fontSize(10).text("1", 280, 250);
  // doc.fillColor("#444444").fontSize(10).text("Rp. 250.000", 380, 250);
  // doc.fillColor("#444444").fontSize(10).text("Rp. 250.000", 480, 250);

  let i = 0;
  let y = 0;

  let total = 0;

  Invoice.items.forEach((item) => {
    i++;
    let subtotal = parseInt(item.qty) * parseInt(item.price);
    doc
      .fillColor("#444444")
      .fontSize(10)
      .text(i, 50, 250 + y);
    doc
      .fillColor("#444444")
      .fontSize(10)
      .text(item.name, 100, 250 + y);
    doc
      .fillColor("#444444")
      .fontSize(10)
      .text(item.qty, 280, 250 + y);
    doc
      .fillColor("#444444")
      .fontSize(10)
      .text(item.price, 380, 250 + y);
    doc
      .fillColor("#444444")
      .fontSize(10)
      .text(subtotal, 480, 250 + y);

    y = y + 15;

    total = total + parseInt(subtotal);
  });

  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, 265)
    .lineTo(550, 265)
    .stroke();

  console.log(total);

  const headers = {
    apikey: process.env.APILayerTax,
  };

  const url = `https://api.apilayer.com/tax_data/price?amount=${total}&country=ID`;

  const response = await axios.get(url, { headers }).catch((err) => {
    console.log(err);
    return res.status(500).json({
      message: "Something went wrong",
    });
  });

  const data = response.data;

  let selisih = parseInt(response.data.price_incl_vat) - total;

  doc.fillColor("#444444").fontSize(10).text("PPN 11%", 380, 275);
  doc
    .fillColor("#444444")
    .fontSize(10)
    .text("Rp. " + numberWithCommas(selisih), 480, 275);

  doc.fillColor("#444444").fontSize(10).text("Total", 380, 290);
  doc
    .fillColor("#444444")
    .fontSize(10)
    .text("Rp. " + numberWithCommas(data.price_incl_vat), 480, 290);

  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, 305)
    .lineTo(550, 305)
    .stroke();

  doc.end();

  doc.pipe(fs.createWriteStream("invoice2.pdf"));
}

const ListInvoices = async (req, res) => {
  const Invoice = await db.invoices.findAll({
    include: [
      {
        model: db.items,
        attributes: ["id", "name", "qty", "price"],
      },
      {
        model: db.users,
        where: {
          id: req.user,
        },
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
      {
        model: db.users,
        where: {
          id: req.user,
        },
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

  if (!req.file)
    return res.status(400).send({ message: "LOGO is a required field" });
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
    message: "Invoice has been created",
    invoice: id,
  });
};
const UpdateInvoice = async (req, res) => {
  const id = req.params.invoiceId;
  const { name, address, customer } = req.body;

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

  Invoice.name = name ? name : Invoice.name;
  Invoice.address = address ? address : Invoice.address;
  Invoice.customer = customer ? customer : Invoice.customer;
  Invoice.logo = req.file ? req.file.path : filePath;
  Invoice.updatedAt = new Date();
  await Invoice.save();
  console.log(req.file.path);

  const User = await db.users.findByPk(req.user);
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

  templateInvoice1(Invoice.id);

  // const table = {
  //   headers: [
  //     {
  //       label: "No",
  //       property: "No",
  //       width: 30,
  //       headerColor: "#0000FF",
  //       headerOpacity: 0.5,
  //       align: "center",
  //       renderer: null,
  //     },
  //     {
  //       label: "Kode Barang",
  //       property: "Kode",
  //       width: 90,
  //       headerColor: "#0000FF",
  //       headerOpacity: 0.5,
  //       align: "left",
  //       renderer: null,
  //     },
  //     {
  //       label: "Nama Barang",
  //       property: "Barang",
  //       width: 120,
  //       headerColor: "#0000FF",
  //       headerOpacity: 0.5,
  //       align: "left",
  //       renderer: null,
  //     },
  //     {
  //       label: "Qty",
  //       property: "Qty",
  //       width: 40,
  //       headerColor: "#0000FF",
  //       headerOpacity: 0.5,
  //       align: "center",
  //       renderer: null,
  //     },
  //     {
  //       label: "Harga",
  //       property: "Harga",
  //       width: 100,
  //       headerColor: "#0000FF",
  //       headerOpacity: 0.5,
  //       align: "center",
  //       renderer: (value) => `Rp ${Number(value).toFixed(2)}`,
  //     },
  //     {
  //       label: "Subtotal",
  //       property: "Subtotal",
  //       width: 100,
  //       headerColor: "#0000FF",
  //       headerOpacity: 0.5,
  //       align: "center",
  //       renderer: (value) => `Rp ${Number(value).toFixed(2)}`,
  //     },
  //   ],
  //   rows: [],
  // };
  // const tabletotal = {
  //   headers: [
  //     {
  //       label: "Blank",
  //       property: "Blank",
  //       width: 280,
  //       align: "right",
  //       renderer: null,
  //     },
  //     {
  //       label: "Total",
  //       property: "Total",
  //       width: 100,
  //       align: "center",
  //       renderer: null,
  //     },
  //     {
  //       label: "Value",
  //       property: "Value",
  //       width: 100,
  //       align: "center",
  //       renderer: (value) => `Rp ${Number(value).toFixed(2)}`,
  //     },
  //   ],
  //   rows: [],
  // };

  // let Amount = 0;
  // Item.forEach((element, idx) => {
  //   const newRow = [
  //     idx + 1,
  //     element.id,
  //     element.name,
  //     element.qty,
  //     element.price,
  //     element.qty * element.price,
  //   ];
  //   table.rows.push(newRow);
  //   Amount += element.qty * element.price;
  // });

  // const url = `https://api.apilayer.com/tax_data/price?amount=${Amount}&country=ID`;
  // const headers = {
  //   apikey: process.env.APILayerTax,
  // };
  // let { PPn, Result } = 0;
  // await axios
  //   .get(url, { headers })
  //   .then((response) => {
  //     PPn = response.data.price_excl_vat * response.data.vat_rate;
  //     Result = response.data.price_incl_vat;
  //   })
  //   .catch((error) => {
  //     console.error(error);
  //   });

  // tabletotal.rows.push(["", "PPn 11 %", PPn]);
  // tabletotal.rows.push(["", "Total", Result]);

  // const doc = new PDFDocument();
  // doc.pipe(fs.createWriteStream("Invoice.pdf"));
  // doc.save();
  // doc.circle(450, 130, 100).clip();
  // doc.image(Invoice.logo, 350, 30, {
  //   width: 200,
  //   height: 200,
  // });
  // doc.restore();
  // doc.font("Helvetica-Bold").fontSize(20).text(Invoice.name).moveDown(3);
  // doc.fontSize(10).text(`Invoice   : ${Invoice.id}`);
  // doc
  //   .fontSize(10)
  //   .text(`Tanggal  : ${Invoice.createdAt.toLocaleDateString("en-GB")}`);
  // doc.fontSize(10).text(`Address : ${Invoice.address}`);
  // doc.fontSize(10).text(`Sales      : ${Invoice.seller}`).moveDown(1);

  // doc.table(table, {
  //   title: {
  //     label: "FAKTUR PENJUALAN",
  //     fontSize: 15,
  //   },
  //   divider: {
  //     header: { disabled: false, width: 2, opacity: 1 },
  //     horizontal: { disabled: false, width: 1, opacity: 0.5 },
  //   },
  //   columnSpacing: 5,
  //   minRowHeight: 0,
  //   prepareHeader: () => doc.font("Helvetica-Bold").fontSize(12),
  //   prepareRow: () => doc.font("Helvetica").fontSize(10),
  // });

  // doc.table(tabletotal, {
  //   divider: {
  //     header: { disabled: false, width: 2, opacity: 1 },
  //     horizontal: { disabled: false, width: 1, opacity: 0.5 },
  //   },
  //   columnSpacing: 5,
  //   hideHeader: true,
  //   prepareRow: () => doc.font("Helvetica-Bold").fontSize(10),
  // });

  // doc.pipe(res);
  // doc.end();
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
