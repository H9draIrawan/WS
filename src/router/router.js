const express = require("express")
const router = express.Router()

const RouterLocation = require('./RouterLocation')
const RouterOrder = require('./RouterOrder') 
const RouterPickup = require('./RouterPickup') 
const RouterPricing = require('./RouterPricing') 

router.use('/location',RouterLocation)
router.use('/order',RouterOrder)
router.use('/pickup',RouterPickup)
router.use('/pricing',RouterPricing)

module.exports = router