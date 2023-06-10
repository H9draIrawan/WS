const Joi = require("joi");
const bcrypt = require("bcrypt");
const Nanoid = require("nanoid");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

const db = require("../models/index");

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

async function CekToken(req, res, next) {
  const schema = Joi.string().required().empty().messages({
    "any.required": "x-auth-token cannot be an empty field",
    "string.empty": "x-auth-token is a required field",
  });
  try {
    await schema.validateAsync(req.headers["x-auth-token"]);
  } catch (err) {
    return res.status(400).send({ message: err.message });
  }

  try {
    const checking = jwt.verify(
      req.headers["x-auth-token"],
      process.env.JWT_Secret_Key
    );
    req.token = checking.id;
    // console.log(req.token);
  } catch (err) {
    return res.status(400).send({ message: "Invalid JWT Token" });
  }
  next();
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
      id,
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
    const errorMessage = error.details[0]?.message || "Validation error";
    const cleanedError = errorMessage.replace(/"/g, "");
    res.status(400).json({
      message: cleanedError,
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
    password: Joi.string().min(6).label("Password").required(),
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
        email,
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
          expiresIn: "5m",
        }
      );
      console.log(token);
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

const TopupSaldo = async (req, res) => {
  const User = await db.users.findByPk(req.token);
  const { saldo } = req.body;
  const schema = Joi.number().min(100000).max(10000000).required().messages({
    "any.required": "Topup saldo is a required field",
    "number.min": "Topup saldo minimum balance Rp.100.000",
    "number.max": "Topup saldo maximum balance Rp.10.000.000",
  });

  try {
    await schema.validateAsync(req.body.saldo);
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }

  User.saldo += saldo;
  User.updatedAt = new Date();
  User.save();
  return res.status(200).send({ message: `Success Topup Rp.${saldo}` });
};
const TopupApihit = async (req, res) => {
  const User = await db.users.findByPk(req.token);
  const { apihit } = req.body;
  const schema = Joi.number().min(1).max(1000).required().messages({
    "any.required": "Topup apihit is a required field",
    "number.min": "Topup apihit minimum balance 1",
    "number.max": "Topup apihit maximum balance 1000",
  });

  try {
    await schema.validateAsync(req.body.apihit);
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }

  User.saldo -= apihit * 3200;
  User.apiHit += apihit;
  User.updatedAt = new Date();
  if (User.saldo < 0)
    return res.status(400).send({ message: "Saldo not enough" });
  User.save();
  return res.status(200).send({ message: `Success Topup ${apihit} Apihit` });
};

const CekSaldo = async (req, res) => {
  const User = await db.users.findByPk(req.token);
  return res.status(400).send({
    message: `Remaining Saldo Rp.${User.saldo}`,
  });
};

const CekApihit = async (req, res) => {
  const User = await db.users.findByPk(req.token);
  return res.status(400).send({
    message: `Remaining Apihit ${User.apiHit}`,
  });
};

module.exports = {
  RegisterUser,
  LoginUser,
  TopupSaldo,
  TopupApihit,
  CekSaldo,
  CekApihit,
  CekToken,
};
