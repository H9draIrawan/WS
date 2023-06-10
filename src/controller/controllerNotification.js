const Joi = require("joi");
const bcrypt = require("bcrypt");
const Nanoid = require("nanoid");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

const db = require("../models/index");

module.exports = {
    async getNotification(req, res) {
        // webhook notification
        let data = req.body;
        let orderId = data.order_id;
        let transactionStatus = data.transaction_status;
        let fraudStatus = data.fraud_status;
        
    }
};
