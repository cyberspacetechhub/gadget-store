const mongoose = require('mongoose');
const User = require('../User');

const AdminSchema = new mongoose.Schema({
    permissions: [{
        type: String,
        enum: ['users', 'products', 'orders', 'analytics', 'settings']
    }],
    lastLogin: Date,
    loginAttempts: {
        type: Number,
        default: 0
    },
    isSuper: {
        type: Boolean,
        default: false
    },
});

module.exports = User.discriminator('Admin', AdminSchema);