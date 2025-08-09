const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin/adminController');
const verifyRoles = require('../middleware/verifyRoles');
const ROLES_LIST = require('../config/rolesList');

// All routes require Admin role
router.use(verifyRoles(ROLES_LIST.Admin));

// Dashboard
router.get('/dashboard', adminController.getDashboardStats);
router.get('/analytics', adminController.getAnalytics);

// Admin management
router.get('/profile', adminController.getProfile);
router.put('/profile', adminController.updateProfile);
router.put('/change-password', adminController.changePassword);
router.put('/admins/:adminId/permissions', adminController.updatePermissions);

// User management
router.get('/users', adminController.getAllCustomers);
router.get('/users/:id', adminController.getCustomer);
router.put('/users/:id', adminController.updateCustomer);
router.delete('/users/:id', adminController.deleteCustomer);
router.put('/users/:id/status', adminController.toggleCustomerStatus);
router.get('/customers', adminController.getAllCustomers);
router.put('/customers/:customerId/status', adminController.updateCustomerStatus);

module.exports = router;