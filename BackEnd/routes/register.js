const express = require('express');
const router = express.Router();
const { register } = require('../controllers/customer/customerController');
const { createAdmin } = require('../controllers/admin/adminController');

router.post('/', register);
router.post('/admins', createAdmin);
module.exports = router;