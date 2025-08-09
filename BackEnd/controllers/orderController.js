const orderService = require('../services/order/orderService');
const APIResponse = require('../utils/APIResponse');
const catchAsync = require('../utils/catchAsync');

const createOrder = catchAsync(async (req, res) => {
    const { items, shippingAddress, paymentMethod, totalAmount } = req.body;
    
    // Map payment method to valid enum values
    const paymentMethodMap = {
        'card': 'paystack',
        'bank_transfer': 'bank_transfer',
        'cash_on_delivery': 'cash_on_delivery'
    };
    
    const orderData = {
        user: req.userId,
        items: items.map(item => ({
            product: item.product,
            name: item.name || item.product?.name,
            image: item.image || item.product?.images?.[0],
            price: item.price,
            quantity: item.quantity,
            total: item.price * item.quantity
        })),
        shippingAddress: {
            firstName: shippingAddress.firstName,
            lastName: shippingAddress.lastName,
            email: shippingAddress.email,
            phone: shippingAddress.phone,
            address: shippingAddress.street,
            city: shippingAddress.city,
            state: shippingAddress.state,
            zipCode: shippingAddress.zipCode,
            country: shippingAddress.country || 'Nigeria'
        },
        paymentMethod: paymentMethodMap[paymentMethod] || 'paystack',
        subtotal: totalAmount,
        totalAmount
    };
    
    const order = await orderService.createOrder(orderData);
    APIResponse.success(res, order, 'Order created successfully', 201);
});

const getOrders = catchAsync(async (req, res) => {
    const { page = 1, limit = 10, status, paymentStatus } = req.query;
    const filters = {};
    
    if (status) filters.orderStatus = status;
    if (paymentStatus) filters.paymentStatus = paymentStatus;
    
    const result = await orderService.getOrders(filters, page, limit);
    APIResponse.success(res, result, 'Orders retrieved successfully');
});

const getOrderById = catchAsync(async (req, res) => {
    const order = await orderService.getOrderById(req.params.id);
    APIResponse.success(res, order, 'Order retrieved successfully');
});

const getUserOrders = catchAsync(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const result = await orderService.getUserOrders(req.userId, page, limit);
    APIResponse.success(res, result, 'User orders retrieved successfully');
});

const updateOrderStatus = catchAsync(async (req, res) => {
    const { status, note } = req.body;
    const order = await orderService.updateOrderStatus(req.params.id, status, note);
    APIResponse.success(res, order, 'Order status updated successfully');
});

const updatePaymentStatus = catchAsync(async (req, res) => {
    const { paymentStatus, paymentReference } = req.body;
    const order = await orderService.updatePaymentStatus(req.params.id, paymentStatus, paymentReference);
    APIResponse.success(res, order, 'Payment status updated successfully');
});

const cancelOrder = catchAsync(async (req, res) => {
    const order = await orderService.cancelOrder(req.params.id, req.userId);
    APIResponse.success(res, order, 'Order cancelled successfully');
});

const getOrderStats = catchAsync(async (req, res) => {
    const stats = await orderService.getOrderStats();
    APIResponse.success(res, stats, 'Order statistics retrieved successfully');
});

const deleteOrder = catchAsync(async (req, res) => {
    await orderService.deleteOrder(req.params.id);
    APIResponse.success(res, null, 'Order deleted successfully');
});

const bulkDeleteOrders = catchAsync(async (req, res) => {
    const { orderIds } = req.body;
    const result = await orderService.bulkDeleteOrders(orderIds);
    APIResponse.success(res, result, 'Orders deleted successfully');
});

module.exports = {
    createOrder,
    getOrders,
    getOrderById,
    getUserOrders,
    updateOrderStatus,
    updatePaymentStatus,
    cancelOrder,
    getOrderStats,
    deleteOrder,
    bulkDeleteOrders
};