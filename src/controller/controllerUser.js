const Joi = require("joi");
const bcrypt = require("bcrypt");
const Nanoid = require("nanoid");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const nodemailer = require("nodemailer");

const rateLimit = require("express-rate-limit");

const db = require("../models/index");

const midtransClient = require("midtrans-client");
const Axios = require("axios");

const coreApi = new midtransClient.CoreApi({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

async function generateAPIKey() {
  const apiKey = Nanoid.nanoid(10);
  const check = await db.users.findOne({
    where: {
      apiKey,
    },
  });
  if (check) {
    generateAPIKey();
  } else {
    return apiKey;
  }
}

async function emailIsExist(email) {
  const check = await db.users.findOne({
    where: {
      email: email,
    },
  });
  if (check) {
    throw new Error("Email already exist");
  } else {
    return email;
  }
}

async function emailIsNotExist(email) {
  const check = await db.users.findOne({
    where: {
      email: email,
    },
  });
  if (!check) {
    throw new Error("Email does not exist");
  } else {
    return email;
  }
}

async function generateIDUser() {
  const id = "user-" + Nanoid.nanoid(5);
  const check = await db.users.findOne({
    where: {
      id,
    },
  });

  if (check) {
    generateIDUser();
  } else {
    return id;
  }
}

const RegisterUser = async (req, res) => {
  const { email, password, confirm_password, name } = req.body;
  const schema = Joi.object({
    email: Joi.string()
      .email()
      .min(6)
      .label("Email")
      .external(emailIsExist)
      .required(),
    password: Joi.string().min(6).label("Password").required(),
    name: Joi.string().min(3).label("Name").required(),
    confirm_password: Joi.string().required().valid(Joi.ref("password")),
  }).messages({
    "string.base": "should be a type of 'text'",
    "string.empty": "cannot be an empty field",
    "string.min": "{#label} should have a minimum length of {#limit}",
    "any.required": "{#label} is a required field",
    "string.email": "email is not valid",
    "any.only": "confirm password does not match with password",
  });

  let hashPassword = bcrypt.hashSync(password, 12);

  const apiKey = await generateAPIKey();
  const id = await generateIDUser();

  try {
    await schema.validateAsync(req.body);
    const data = await db.users.create({
      id: id,
      email,
      password: hashPassword,
      name,
      saldo: 0,
      apiHit: 0,
      apiKey,
    });

    res.status(200).json({
      message: "Register Success",
      email: data.email,
      name: data.name,
      apiKey: data.apiKey,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const LoginUser = async (req, res) => {
  const { email, password } = req.body;

  const schema = Joi.object({
    email: Joi.string()
      .email()
      .label("Email")
      .external(emailIsNotExist)
      .required(),
    password: Joi.string().label("Password").required(),
  }).messages({
    "string.base": "should be a type of 'text'",
    "string.empty": "cannot be an empty field",
    "string.min": "{#label} should have a minimum length of {#limit}",
    "any.required": "{#label} is a required field",
  });

  try {
    await schema.validateAsync(req.body);

    const data = await db.users.findOne({
      where: {
        email: email,
      },
    });
    const checkPassword = bcrypt.compareSync(password, data.password);

    if (checkPassword) {
      const token = jwt.sign(
        {
          id: data.id,
          email: data.email,
        },
        process.env.JWT_Secret_Key,
        {
          expiresIn: "1d",
        }
      );

      res.status(200).json({
        message: "Login Success",
        email: data.email,
        name: data.name,
        apiKey: data.apiKey,
        token: token,
      });
    } else {
      res.status(400).json({
        message: "Incorrect password",
      });
    }
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

let order_id = "";

const TopupSaldo = async (req, res) => {
  const validation = Joi.string().required().empty().messages({
    "any.required": "x-auth-token is a required field",
    "string.empty": "x-auth-token cannot be an empty field",
  });
  try {
    await validation.validateAsync(req.headers["x-auth-token"]);
    await validation.validateAsync(req.headers["x-api-key"]);
  } catch (err) {
    return res.status(400).send({ message: err.message });
  }

  const apiKey = req.headers["x-api-key"];

  const User = await db.users.findOne({
    where: {
      apiKey: apiKey,
    },
  });

  if (!User) {
    return res.status(400).json({
      message: "Invalid API Key",
    });
  }

  const decoded = jwt.verify(
    req.headers["x-auth-token"],
    process.env.JWT_Secret_Key
  );

  if (decoded.email !== User.email) {
    return res.status(400).json({
      message: "API Key or Token is not valid",
    });
  }

  const { saldo } = req.body;
  const schema = Joi.number().min(100000).max(10000000).required().messages({
    "any.required": "saldo is a required field",
    "number.min": "Topup saldo minimum balance Rp.100.000",
    "number.max": "Topup saldo maximum balance Rp.10.000.000",
    "number.base": "Topup saldo must number",
  });

  try {
    await schema.validateAsync(req.body.saldo);
    let count = 1;
    let date = new Date().toLocaleDateString().split("/").join("");
    let uniqueSuffix = Math.floor(10000 + Math.random() * 90000); // 5 digit angka random

    // const response = await Axios.get(
    //   `https://api.apilayer.com/tax_data/price?amount=${saldo}&country=ID`,
    //   {
    //     headers: {
    //       apiKey: process.env.APILayerTax,
    //     },
    //   }
    // );

    // const incl_vat = response.data.price_incl_vat;

    const transaction_details = {
      order_id: `order-${date}-${uniqueSuffix}`,
      gross_amount: parseInt(saldo) + 2500,
    };

    const transaction = await coreApi.charge({
      payment_type: "bank_transfer",
      bank_transfer: {
        bank: "bca",
      },
      customer_details: {
        email: User.email,
      },
      transaction_details,
    });

    const va_number = transaction.va_numbers[0].va_number;

    order_id = transaction.order_id;

    const T = await db.transactions.create({
      id: order_id,
      userId: User.id,
      payment_status: 0,
      amount: saldo,
    });

    return res.status(200).send({
      order_id: transaction.order_id,
      "BCA Virtual Account Number": va_number,
      Saldo: parseInt(saldo),
      Tax: 2500,
      Total: parseInt(saldo) + 2500,
    });
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

const TopupApihit = async (req, res) => {
  const validation = Joi.string().required().empty().messages({
    "any.required": "x-auth-token is a required field",
    "string.empty": "x-auth-token cannot be an empty field",
  });
  try {
    await validation.validateAsync(req.headers["x-auth-token"]);
    await validation.validateAsync(req.headers["x-api-key"]);
  } catch (err) {
    return res.status(400).send({ message: err.message });
  }

  const apiKey = req.headers["x-api-key"];

  const User = await db.users.findOne({
    where: {
      apiKey: apiKey,
    },
  });

  if (!User) {
    return res.status(400).json({
      message: "Invalid API Key",
    });
  }

  const decoded = jwt.verify(
    req.headers["x-auth-token"],
    process.env.JWT_Secret_Key
  );

  if (decoded.email !== User.email) {
    return res.status(400).json({
      message: "API Key or Token is not valid",
    });
  }

  const { apihit } = req.body;

  const schema = Joi.number().label("Apihit").min(1).required().messages({
    "any.required": "Apihit is a required field",
    "number.min": "Apihit minimum balance 1",
    "number.base": "Apihit must number",
  });

  try {
    await schema.validateAsync(req.body.apihit);
    User.saldo -= parseInt(apihit * 3200);
    User.apiHit += parseInt(apihit);
    User.updatedAt = new Date();
    if (User.saldo < 0)
      return res.status(400).send({ message: "Saldo not enough" });
    User.save();
    return res.status(200).send({ message: `Success Topup ${apihit} Apihit` });
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

const CekSaldo = async (req, res) => {
  const validation = Joi.string().required().empty().messages({
    "any.required": "x-auth-token is a required field",
    "string.empty": "x-auth-token cannot be an empty field",
  });
  try {
    await validation.validateAsync(req.headers["x-auth-token"]);
    await validation.validateAsync(req.headers["x-api-key"]);
  } catch (err) {
    return res.status(400).send({ message: err.message });
  }

  const apiKey = req.headers["x-api-key"];

  const User = await db.users.findOne({
    where: {
      apiKey: apiKey,
    },
  });

  if (!User) {
    return res.status(400).json({
      message: "Invalid API Key",
    });
  }

  const decoded = jwt.verify(
    req.headers["x-auth-token"],
    process.env.JWT_Secret_Key
  );

  if (decoded.email !== User.email) {
    return res.status(400).json({
      message: "API Key or Token is not valid",
    });
  }

  return res.status(200).send({
    message: `Remaining Saldo Rp.${User.saldo}`,
  });
};

const CekApihit = async (req, res) => {
  const validation = Joi.string().required().empty().messages({
    "any.required": "x-auth-token is a required field",
    "string.empty": "x-auth-token cannot be an empty field",
  });
  try {
    await validation.validateAsync(req.headers["x-auth-token"]);
    await validation.validateAsync(req.headers["x-api-key"]);
  } catch (err) {
    return res.status(400).send({ message: err.message });
  }

  const apiKey = req.headers["x-api-key"];

  const User = await db.users.findOne({
    where: {
      apiKey: apiKey,
    },
  });

  if (!User) {
    return res.status(400).json({
      message: "Invalid API Key",
    });
  }

  const decoded = jwt.verify(
    req.headers["x-auth-token"],
    process.env.JWT_Secret_Key
  );

  if (decoded.email !== User.email) {
    return res.status(400).json({
      message: "API Key or Token is not valid",
    });
  }

  return res.status(200).send({
    message: `Remaining Apihit ${User.apiHit}`,
  });
};

let status = "";
let gross_amount = 0;
const cekStatus = async (order_id) => {
  await Axios.get(`https://api.sandbox.midtrans.com/v2/${order_id}/status`, {
    headers: {
      Accept: "application/json",
      authorization: `Basic ${btoa(process.env.MIDTRANS_SERVER_KEY)}`,
    },
  })
    .then((response) => {
      console.log(status, gross_amount);
      status = response.data.transaction_status;
      gross_amount = response.data.gross_amount;
    })
    .catch((error) => {
      console.log(error);
    });
};

const Webhook = async (req, res) => {
  await cekStatus(order_id);
  const T = await db.transactions.findOne({
    where: {
      id: order_id,
    },
  });

  if (T.payment_status == 0) {
    if (status == "settlement") {
      const User = await db.users.findOne({
        where: {
          id: T.userId,
        },
      });

      const u = await db.users.update(
        {
          saldo: User.saldo + parseInt(gross_amount),
        },
        {
          where: {
            id: T.userId,
          },
        }
      );

      const t = await db.transactions.update(
        {
          payment_status: 1,
        },
        {
          where: {
            id: order_id,
          },
        }
      );

      return res.status(200).send({
        message: `Topup saldo Rp.${gross_amount} Success`,
      });
    }
  } else {
    return res.status(400).send({
      message: `Topup saldo Rp.${gross_amount} Failed`,
    });
  }
};

const cekAPILayer = async (req, res) => {
  const response = await Axios.get(
    "https://api.apilayer.com/tax_data/price?amount=150000&country=ID",
    {
      headers: {
        apiKey: process.env.APILayerTax,
      },
    }
  );

  console.log(response.data);

  return res.status(200).send({
    message: response.data,
  });
};

module.exports = {
  RegisterUser,
  LoginUser,
  TopupSaldo,
  TopupApihit,
  CekSaldo,
  CekApihit,
  Webhook,
  cekAPILayer,
};
