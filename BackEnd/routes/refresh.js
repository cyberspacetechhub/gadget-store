const express = require('express');
const router = express.Router();
const { refresh } = require('../controllers/auth/refreshController');

router.get('/', refresh);

module.exports = router;