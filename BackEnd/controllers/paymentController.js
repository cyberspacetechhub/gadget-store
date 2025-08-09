const paystackService = require('../services/payment/paystackService');
const orderService = require('../services/order/orderService');
const catchAsync = require('../utils/catchAsync');

const initializePayment = catchAsync(async (req, res) => {
    const { orderId, email, amount, paymentMethod } = req.body;
    
    const result = await paystackService.initializePayment(email, amount, orderId, paymentMethod);
    
    if (result.success) {
        res.json({
            success: true,
            data: result.data,
            message: 'Payment initialized successfully'
        });
    } else {
        res.status(400).json({
            success: false,
            message: result.error
        });
    }
});

const verifyPayment = catchAsync(async (req, res) => {
    const { reference } = req.body;
    
    const result = await paystackService.verifyPayment(reference);
    
    if (result.success) {
        // Update order status
        await orderService.updateOrderPaymentStatus(result.orderId, 'paid', {
            paymentMethod: 'paystack',
            paymentReference: reference,
            paidAt: new Date()
        });
        
        res.json({
            success: true,
            data: result.data,
            message: 'Payment verified successfully'
        });
    } else {
        res.status(400).json({
            success: false,
            message: result.error
        });
    }
});

const confirmCashOnDelivery = catchAsync(async (req, res) => {
    const { orderId } = req.body;
    
    await orderService.updateOrderPaymentStatus(orderId, 'pending', {
        paymentMethod: 'cash_on_delivery',
        confirmedAt: new Date()
    });
    
    res.json({
        success: true,
        message: 'Cash on delivery order confirmed'
    });
});

const handleWebhook = catchAsync(async (req, res) => {
    const { event, data } = req.body;
    
    if (event === 'charge.success') {
        const result = await paystackService.verifyPayment(data.reference);
        
        if (result.success) {
            await orderService.updateOrderPaymentStatus(result.orderId, 'paid', {
                paymentMethod: 'paystack',
                paymentReference: data.reference,
                paidAt: new Date()
            });
        }
    }
    
    res.status(200).send('OK');
});

module.exports = {
    initializePayment,
    verifyPayment,
    confirmCashOnDelivery,
    handleWebhook
};