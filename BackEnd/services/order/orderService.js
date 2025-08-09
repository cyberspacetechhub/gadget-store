const Order = require('../../models/Order');
const Product = require('../../models/Product');
const { ValidationError, NotFoundError } = require('../../utils/customErrors');

class OrderService {
    async createOrder(orderData) {
        // Validate products and calculate totals
        let subtotal = 0;
        const validatedItems = [];

        for (const item of orderData.items) {
            const product = await Product.findById(item.product);
            if (!product) {
                throw new ValidationError(`Product ${item.product} not found`);
            }
            
            if (product.stock.trackStock && product.stock.quantity < item.quantity) {
                throw new ValidationError(`Insufficient stock for ${product.name}`);
            }

            const itemTotal = product.price * item.quantity;
            subtotal += itemTotal;

            validatedItems.push({
                product: product._id,
                name: product.name,
                image: product.images[0]?.url || '',
                price: product.price,
                quantity: item.quantity,
                total: itemTotal
            });
        }

        const totalAmount = subtotal + (orderData.shippingFee || 0) + (orderData.tax || 0) - (orderData.discount || 0);

        const order = await Order.create({
            ...orderData,
            items: validatedItems,
            subtotal,
            totalAmount
        });

        // Update product stock
        for (const item of validatedItems) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { 'stock.quantity': -item.quantity }
            });
        }

        return await order.populate('user', 'firstName lastName email');
    }

    async getOrders(filters = {}, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const query = { ...filters };

        const orders = await Order.find(query)
            .populate('user', 'firstName lastName email')
            .sort('-createdAt')
            .skip(skip)
            .limit(Number(limit));

        const total = await Order.countDocuments(query);
        return { orders, total };
    }

    async getOrderById(id) {
        const order = await Order.findById(id)
            .populate('user', 'firstName lastName email')
            .populate('items.product', 'name images');
        
        if (!order) {
            throw new NotFoundError('Order not found');
        }
        return order;
    }

    async getUserOrders(userId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        
        const orders = await Order.find({ user: userId })
            .populate('items.product', 'name images')
            .sort('-createdAt')
            .skip(skip)
            .limit(Number(limit));

        const total = await Order.countDocuments({ user: userId });
        return { orders, total };
    }

    async updateOrderStatus(id, status, note = '') {
        const order = await Order.findById(id);
        if (!order) {
            throw new NotFoundError('Order not found');
        }

        order.addStatusHistory(status, note);
        await order.save();
        
        return order;
    }

    async updatePaymentStatus(id, paymentStatus, paymentReference = '') {
        const order = await Order.findByIdAndUpdate(
            id,
            { paymentStatus, paymentReference },
            { new: true }
        );
        
        if (!order) {
            throw new NotFoundError('Order not found');
        }
        return order;
    }

    async updateOrderPaymentStatus(orderId, paymentStatus, paymentDetails = {}) {
        const order = await Order.findByIdAndUpdate(
            orderId,
            { 
                paymentStatus,
                paymentDetails: { ...paymentDetails },
                updatedAt: new Date()
            },
            { new: true }
        ).populate('user', 'firstName lastName email');

        if (!order) {
            throw new NotFoundError('Order not found');
        }

        return order;
    }

    async cancelOrder(id, userId = null) {
        const order = await Order.findById(id);
        if (!order) {
            throw new NotFoundError('Order not found');
        }

        if (userId && order.user.toString() !== userId) {
            throw new ValidationError('You can only cancel your own orders');
        }

        if (['shipped', 'delivered'].includes(order.orderStatus)) {
            throw new ValidationError('Cannot cancel shipped or delivered orders');
        }

        // Restore product stock
        for (const item of order.items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { 'stock.quantity': item.quantity }
            });
        }

        order.addStatusHistory('cancelled', 'Order cancelled');
        await order.save();
        
        return order;
    }

    async getOrderStats() {
        const stats = await Order.aggregate([
            {
                $group: {
                    _id: '$orderStatus',
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$totalAmount' }
                }
            }
        ]);

        const totalOrders = await Order.countDocuments();
        const totalRevenue = await Order.aggregate([
            { $match: { paymentStatus: 'paid' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        return {
            statusBreakdown: stats,
            totalOrders,
            totalRevenue: totalRevenue[0]?.total || 0
        };
    }

    async deleteOrder(id) {
        const order = await Order.findById(id);
        if (!order) {
            throw new NotFoundError('Order not found');
        }

        // Restore product stock if order was not cancelled
        if (order.orderStatus !== 'cancelled') {
            for (const item of order.items) {
                await Product.findByIdAndUpdate(item.product, {
                    $inc: { 'stock.quantity': item.quantity }
                });
            }
        }

        await Order.findByIdAndDelete(id);
        return { deleted: true };
    }

    async bulkDeleteOrders(orderIds) {
        if (!Array.isArray(orderIds) || orderIds.length === 0) {
            throw new ValidationError('Order IDs array is required');
        }

        const orders = await Order.find({ _id: { $in: orderIds } });
        
        // Restore stock for non-cancelled orders
        for (const order of orders) {
            if (order.orderStatus !== 'cancelled') {
                for (const item of order.items) {
                    await Product.findByIdAndUpdate(item.product, {
                        $inc: { 'stock.quantity': item.quantity }
                    });
                }
            }
        }

        const result = await Order.deleteMany({ _id: { $in: orderIds } });
        return { deletedCount: result.deletedCount };
    }
}

module.exports = new OrderService();