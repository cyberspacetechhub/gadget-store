const mongoose = require('mongoose');
const User = require('../User');

const CustomerSchema = new mongoose.Schema({
    addresses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address'
    }],
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    loyaltyPoints: {
        type: Number,
        default: 0
    },
    preferredCategories: [String]
});

module.exports = User.discriminator('Customer', CustomerSchema);