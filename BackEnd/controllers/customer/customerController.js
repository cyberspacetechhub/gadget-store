const customerService = require('../../services/user/customerService');
const APIResponse = require('../../utils/APIResponse');
const catchAsync = require('../../utils/catchAsync');
const crypto = require('crypto');

// Register new customer
const register = catchAsync(async (req, res) => {
    const { username, email, password, firstName, lastName, phone } = req.body;

    const customer = await customerService.createCustomer({
        username,
        email,
        password,
        firstName,
        lastName,
        phone
    });

    // Generate email verification token
    const emailToken = crypto.randomBytes(32).toString('hex');
    customer.emailVerificationToken = emailToken;
    await customer.save();

    APIResponse.success(res, {
        user: {
            id: customer._id,
            username: customer.username,
            email: customer.email,
            firstName: customer.firstName,
            lastName: customer.lastName,
            userType: customer.userType
        },
        emailVerificationToken: emailToken
    }, 'Customer registered successfully. Please verify your email.', 201);
});

// Get customer profile
const getProfile = catchAsync(async (req, res) => {
    const customer = await customerService.getCustomerById(req.userId);
    
    APIResponse.success(res, {
        id: customer._id,
        username: customer.username,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
        phone: customer.phone,
        avatar: customer.avatar,
        loyaltyPoints: customer.loyaltyPoints,
        preferredCategories: customer.preferredCategories,
        dateOfBirth: customer.dateOfBirth,
        gender: customer.gender,
        isEmailVerified: customer.isEmailVerified
    }, 'Profile retrieved successfully');
});

// Update customer profile
const updateProfile = catchAsync(async (req, res) => {
    const { firstName, lastName, phone, preferredCategories, dateOfBirth, gender } = req.body;
    
    const customer = await customerService.updateCustomer(req.userId, {
        firstName,
        lastName,
        phone,
        preferredCategories,
        dateOfBirth,
        gender
    });

    APIResponse.success(res, {
        id: customer._id,
        username: customer.username,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
        phone: customer.phone,
        loyaltyPoints: customer.loyaltyPoints,
        preferredCategories: customer.preferredCategories,
        dateOfBirth: customer.dateOfBirth,
        gender: customer.gender
    }, 'Profile updated successfully');
});

// Add to wishlist
const addToWishlist = catchAsync(async (req, res) => {
    const { productId } = req.body;
    
    await customerService.addToWishlist(req.userId, productId);
    
    APIResponse.success(res, null, 'Product added to wishlist');
});

// Remove from wishlist
const removeFromWishlist = catchAsync(async (req, res) => {
    const { productId } = req.params;
    
    await customerService.removeFromWishlist(req.userId, productId);
    
    APIResponse.success(res, null, 'Product removed from wishlist');
});

// Get wishlist
const getWishlist = catchAsync(async (req, res) => {
    const wishlist = await customerService.getWishlist(req.userId);
    
    APIResponse.success(res, wishlist, 'Wishlist retrieved successfully');
});

module.exports = {
    register,
    getProfile,
    updateProfile,
    addToWishlist,
    removeFromWishlist,
    getWishlist
};