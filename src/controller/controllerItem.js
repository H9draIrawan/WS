const { Op } = require("sequelize");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const Nanoid = require("nanoid");

const db = require("../models/index");

async function generateIDItem() {
  const id = "item-" + Nanoid.nanoid(5);
  const check = await db.items.findOne({
    where: {
      id,
    },
  });

  if (check) {
    generateIDItem();
  } else {
    return id;
  }
}

async function HitItem(req, res, next) {
  const CekLogin = Joi.string().empty().required().messages({
    "any.required": "x-auth-token is a required field",
    "string.empty": "x-auth-token cannot be an empty field",
  });
  const CekApiKey = Joi.string().empty().required().messages({
    "any.required": "x-api-key is a required field",
    "string.empty": "x-api-key cannot be an empty field",
  });
  try {
    await CekLogin.validateAsync(req.header("x-auth-token"));
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

const Additem = async (req, res) => {
  const id = req.params.invoiceId;
  const Invoice = await db.invoices.findByPk(id)
  if (!Invoice) return res.status(400).send({ message: "Invalid invoiceId" });

  const temp = req.body;
  if (Array.isArray(temp)) {
    for (let i = 0; i < temp.length; i++) {
      const twins = await db.items.findOne({
        where: {
          name: temp[i].name,
        },
      });
      if (temp[i].name && !twins && temp[i].qty > 0 && temp[i].price > 0) {
        await db.items.create({
          id: await generateIDItem(),
          name: temp[i].name,
          qty: temp[i].qty,
          price: temp[i].price,
          invoiceId: id,
        });
      }
    }
  } else {
    const twins = await db.items.findOne({
      where: {
        name: temp.name,
      },
    });
    if (temp.name && !twins && temp.qty > 0 && temp.price > 0) {
      await db.items.create({
        id: await generateIDItem(),
        name: temp.name,
        qty: temp.qty,
        price: temp.price,
        invoiceId: id,
      });
    }
  }

  const User = await db.users.findByPk(req.user);
  User.apiHit--;
  User.updatedAt = new Date();
  User.save();

  return res.status(201).send({ message: "Item has been added" });
};
const Updateitem = async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().empty().required().messages({
      "any.required": "name is a required field",
      "string.empty": "name cannot be an empty field",
    }),
    qty: Joi.number().min(1).required().messages({
      "any.required": "qty is a required field",
      "number.base": "qty must be a number",
      "number.min": "qty must be greater than or equal to 1",
    }),
    price: Joi.number().min(100).required().messages({
      "any.required": "price is a required field",
      "number.base": "price must be a number",
      "number.min": "price must be greater than or equal to 100",
    }),
  });

  try {
    await schema.validateAsync(req.body);
  } catch (err) {
    return res.status(400).send({ message: err.message });
  }

  const { name, qty, price } = req.body;
  const Item = await db.items.findOne({
    where: {
      name: {
        [Op.like]: `%${name}%`,
      },
    },
  });
  if (!Item) return res.status(404).send({ message: "Item is not found" });
  Item.qty = qty;
  Item.price = price;
  Item.updateAt = new Date();
  Item.save();

  const User = await db.users.findByPk(req.user);
  User.apiHit--;
  User.updatedAt = new Date();
  User.save();

  return res.status(200).send({
    message: "Item has been updated",
    name: Item.name,
    qty: qty,
    price: price,
  });
};
const Deleteitem = async (req, res) => {
  const schema = Joi.string().empty().required().messages({
    "any.required": "name is a required field",
    "string.empty": "name cannot be an empty field",
  });

  try {
    await schema.validateAsync(req.body.name);
  } catch (err) {
    return res.status(400).send({ message: err.message });
  }
  const { name } = req.body;
  const Item = await db.items.findOne({
    where: {
      name: {
        [Op.like]: `%${name}%`,
      },
    },
  });
  if (!Item) return res.status(404).send({ message: "Item is not found" });
  await db.items.destroy({
    where: {
      id: Item.id,
    },
  });

  const User = await db.users.findByPk(req.user);
  User.apiHit--;
  User.updatedAt = new Date();
  User.save();

  return res.status(200).send({ message: "Item has been deleted" });
};

module.exports = {
  Additem,
  Updateitem,
  Deleteitem,
  HitItem,
};
