const Joi = require("joi");
const bcrypt = require("bcrypt");
const Nanoid = require("nanoid");

const salt = bcrypt.genSaltSync(12);
const Users = require("../models/user");

async function APIkeyIsExist(apiKey) {
  const data = await Users.findOne({
    where: {
      apiKey,
    },
  });
  if (data) {
    return true;
  } else {
    return false;
  }
}

const RegisterUser = async (req, res) => {
  const { email, password, confirm_password, username } = req.body;
  const schema = Joi.object({
    email: Joi.string().email().min(6).label("Email").required(),
    password: Joi.string().min(6).label("Password").required(),
    username: Joi.string().min(6).label("Username").required(),
    confirm_password: Joi.string().required().valid(Joi.ref("password")),
  }).messages({
    "string.base": "should be a type of 'text'",
    "string.empty": "cannot be an empty field",
    "string.min": "{#label} should have a minimum length of {#limit}",
    "any.required": "{#label} is a required field",
    "string.email": "email is not valid",
    "any.only": "confirm password does not match with password",
  });

  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).json({
      message: error.details[0].message,
    });
  }

  let hashPassword = bcrypt.hashSync(password, 12);

  const apiKey = Nanoid.nanoid(10);

  const data = await Users.create({
    email,
    password: hashPassword,
    username,
    apiKey,
  });

  res.status(200).json({
    message: "success",
    data,
  });
};

const LoginUser = (req, res) => {
  // Implement the logic for user login
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
