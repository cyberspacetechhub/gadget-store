const express = require('express');
const router = express.Router();
const APIResponse = require('../utils/APIResponse');

// Placeholder routes - to be implemented
router.get('/dashboard', (req, res) => {
    APIResponse.success(res, {}, 'Vendor dashboard endpoint - to be implemented');
});

module.exports = router;