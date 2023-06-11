const axios = require("axios");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const Nanoid = require("nanoid");

const db = require("../models/index");

async function HitInvoice(req, res, next) {
  const CekLogin = Joi.string().empty().required().messages({
    "any.required": "x-auth-token is a required field",
    "string.empty": "x-auth-token cannot be an empty field",
  });
  const CekApiKey = Joi.string().empty().required().messages({
    "any.required": "apiKey is a required field",
    "string.empty": "apiKey cannot be an empty field",
  });
  try {
    await CekLogin.validateAsync(req.header("x-auth-token"));
    await CekApiKey.validateAsync(req.header("apiKey"));
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

  const apiKey = req.header("apiKey");
  const User = await db.users.findOne({
    where: {
      apiKey,
    },
  });

  if (!User) return res.status(404).send({ message: "apiKey not found" });
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

const ListInvoices = (req, res) => {};
const GetSingleInvoice = (req, res) => {};
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
const UpdateInvoice = (req, res) => {};
const DeleteInvoice = (req, res) => {};
const PrintInvoice = (req, res) => {};

module.exports = {
  ListInvoices,
  GetSingleInvoice,
  CreateInvoice,
  UpdateInvoice,
  DeleteInvoice,
  PrintInvoice,
  HitInvoice,
};
