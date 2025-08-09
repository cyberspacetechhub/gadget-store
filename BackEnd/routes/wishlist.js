const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer/customerController');

router.get('/', customerController.getWishlist);
router.post('/add', customerController.addToWishlist);
router.delete('/remove/:productId', customerController.removeFromWishlist);

module.exports = router;