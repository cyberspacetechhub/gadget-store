const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.get('/', cartController.getCart);
router.get('/summary', cartController.getCartSummary);
router.post('/add', cartController.addToCart);
router.put('/update', cartController.updateCartItem);
router.delete('/remove/:productId', cartController.removeFromCart);
router.delete('/clear', cartController.clearCart);
router.post('/sync-prices', cartController.syncCartPrices);
router.post('/migrate', cartController.migrateGuestCart);

module.exports = router;