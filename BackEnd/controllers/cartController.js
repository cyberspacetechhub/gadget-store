const cartService = require('../services/cart/cartService');
const APIResponse = require('../utils/APIResponse');
const catchAsync = require('../utils/catchAsync');

// Get user's cart
const getCart = catchAsync(async (req, res) => {
    const cart = await cartService.getOrCreateCart(req.userId);
    APIResponse.success(res, cart, 'Cart retrieved successfully');
});

// Add item to cart
const addToCart = catchAsync(async (req, res) => {
    const { productId, quantity = 1 } = req.body;
    
    if (!productId) {
        return APIResponse.error(res, 'Product ID is required', 400);
    }
    
    if (!req.userId) {
        return APIResponse.error(res, 'Authentication required', 401);
    }
    
    const cart = await cartService.addToCart(req.userId, productId, quantity);
    APIResponse.success(res, cart, 'Item added to cart successfully');
});

// Update cart item quantity
const updateCartItem = catchAsync(async (req, res) => {
    const { productId, quantity } = req.body;

    const cart = await cartService.updateCartItem(req.userId, productId, quantity);

    APIResponse.success(res, cart, 'Cart updated successfully');
});

// Remove item from cart
const removeFromCart = catchAsync(async (req, res) => {
    const { productId } = req.params;

    const cart = await cartService.removeFromCart(req.userId, productId);

    APIResponse.success(res, cart, 'Item removed from cart successfully');
});

// Clear entire cart
const clearCart = catchAsync(async (req, res) => {
    const cart = await cartService.clearCart(req.userId);

    APIResponse.success(res, cart, 'Cart cleared successfully');
});

// Get cart summary
const getCartSummary = catchAsync(async (req, res) => {
    const summary = await cartService.getCartSummary(req.userId);

    APIResponse.success(res, summary, 'Cart summary retrieved successfully');
});

// Sync cart with product prices (useful for price updates)
const syncCartPrices = catchAsync(async (req, res) => {
    const { cart, updated } = await cartService.syncCartPrices(req.userId);

    APIResponse.success(res, cart, updated ? 'Cart prices updated' : 'Cart prices are up to date');
});

// Migrate guest cart to authenticated user cart
const migrateGuestCart = catchAsync(async (req, res) => {
    const { guestCartItems } = req.body;
    
    if (!req.userId) {
        return APIResponse.error(res, 'Authentication required', 401);
    }
    
    if (!guestCartItems || !Array.isArray(guestCartItems) || guestCartItems.length === 0) {
        return APIResponse.success(res, null, 'No guest cart items to migrate');
    }
    
    const cart = await cartService.migrateGuestCart(req.userId, guestCartItems);
    APIResponse.success(res, cart, 'Guest cart migrated successfully');
});

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartSummary,
    syncCartPrices,
    migrateGuestCart
};