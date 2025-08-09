const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer/customerController');

// All routes require authentication (handled by server.js middleware)

// Profile routes
router.get('/profile', customerController.getProfile);
router.put('/profile', customerController.updateProfile);

// Wishlist routes
router.get('/wishlist', customerController.getWishlist);
router.post('/wishlist', customerController.addToWishlist);
router.delete('/wishlist/:productId', customerController.removeFromWishlist);

module.exports = router;