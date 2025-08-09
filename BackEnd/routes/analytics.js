const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/admin/analyticsController');
const verifyRoles = require('../middleware/verifyRoles');
const ROLES_LIST = require('../config/rolesList');

router.use(verifyRoles(ROLES_LIST.Admin));

router.get('/dashboard', analyticsController.getDashboardAnalytics);
router.get('/sales', analyticsController.getSalesAnalytics);
router.get('/products', analyticsController.getProductAnalytics);
router.get('/customers', analyticsController.getCustomerAnalytics);

module.exports = router;