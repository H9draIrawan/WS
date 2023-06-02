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

const TopupUser = (req, res) => {
  // Implement the logic for topping up user balance
};

const CekSaldoser = (req, res) => {
  // Implement the logic for checking user balance
};

module.exports = {
  RegisterUser,
  LoginUser,
  TopupUser,
  CekSaldoser,
};
