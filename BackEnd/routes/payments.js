const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/webhook', paymentController.handleWebhook);
router.post('/initialize', paymentController.initializePayment);
router.post('/verify', paymentController.verifyPayment);
router.post('/confirm-cod', paymentController.confirmCashOnDelivery);

module.exports = router;