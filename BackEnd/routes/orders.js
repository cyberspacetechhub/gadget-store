const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const verifyJWT = require('../middleware/verifyJWT');
const verifyRoles = require('../middleware/verifyRoles');
const ROLES_LIST = require('../config/rolesList');

// All routes require authentication
router.use(verifyJWT);

// Customer routes
router.post('/', orderController.createOrder);
router.get('/my-orders', orderController.getUserOrders);
router.patch('/:id/cancel', orderController.cancelOrder);

// Admin routes
router.get('/', verifyRoles(ROLES_LIST.Admin), orderController.getOrders);
router.get('/admin', verifyRoles(ROLES_LIST.Admin), orderController.getOrders);
router.get('/stats', verifyRoles(ROLES_LIST.Admin), orderController.getOrderStats);
router.get('/:id', orderController.getOrderById);
router.patch('/:id/status', verifyRoles(ROLES_LIST.Admin), orderController.updateOrderStatus);
router.patch('/:id/payment', verifyRoles(ROLES_LIST.Admin), orderController.updatePaymentStatus);
router.put('/:id/payment-status', verifyRoles(ROLES_LIST.Admin), orderController.updatePaymentStatus);
router.delete('/:id', verifyRoles(ROLES_LIST.Admin), orderController.deleteOrder);
router.delete('/bulk', verifyRoles(ROLES_LIST.Admin), orderController.bulkDeleteOrders);

module.exports = router;