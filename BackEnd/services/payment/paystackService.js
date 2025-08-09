const paystack = require('paystack')(process.env.PAYSTACK_SECRET_KEY);

class PaystackService {
    async initializePayment(email, amount, orderId, paymentMethod = 'card', metadata = {}) {
        try {
            const channels = paymentMethod === 'bank_transfer' 
                ? ['bank', 'bank_transfer'] 
                : ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'];

            const response = await paystack.transaction.initialize({
                email,
                amount: amount * 100, // Convert to kobo
                reference: `order_${orderId}_${Date.now()}`,
                callback_url: `${process.env.FRONTEND_URL}/dashboard/order-success`,
                channels,
                metadata: {
                    orderId,
                    paymentMethod,
                    ...metadata
                }
            });
            
            return {
                success: true,
                data: response.data,
                reference: response.data.reference
            };
        } catch (error) {
            console.error('Paystack initialization error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async verifyPayment(reference) {
        try {
            const response = await paystack.transaction.verify(reference);
            
            return {
                success: response.data.status === 'success',
                data: response.data,
                amount: response.data.amount / 100, // Convert from kobo
                orderId: response.data.metadata?.orderId
            };
        } catch (error) {
            console.error('Paystack verification error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

module.exports = new PaystackService();