const Customer = require('../../models/user/Customer');
const { ValidationError, NotFoundError } = require('../../utils/customErrors');

class CustomerService {
    async createCustomer(userData) {
        const existingUser = await Customer.findOne({
            $or: [{ email: userData.email }, { username: userData.username }]
        });

        if (existingUser) {
            throw new ValidationError('User with this email or username already exists');
        }

        const customer = await Customer.create({
            ...userData,
            userType: 'Customer'
        });

        return customer;
    }

    async getCustomerById(id) {
        const customer = await Customer.findById(id).populate('addresses wishlist');
        if (!customer) {
            throw new NotFoundError('Customer not found');
        }
        return customer;
    }

    async updateCustomer(id, updateData) {
        const customer = await Customer.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!customer) {
            throw new NotFoundError('Customer not found');
        }

        return customer;
    }

    async addToWishlist(customerId, productId) {
        const customer = await Customer.findById(customerId);
        if (!customer) {
            throw new NotFoundError('Customer not found');
        }

        if (!customer.wishlist.includes(productId)) {
            customer.wishlist.push(productId);
            await customer.save();
        }

        return customer;
    }

    async removeFromWishlist(customerId, productId) {
        const customer = await Customer.findById(customerId);
        if (!customer) {
            throw new NotFoundError('Customer not found');
        }

        customer.wishlist = customer.wishlist.filter(id => !id.equals(productId));
        await customer.save();

        return customer;
    }

    async getWishlist(customerId) {
        const customer = await Customer.findById(customerId).populate('wishlist');
        if (!customer) {
            throw new NotFoundError('Customer not found');
        }
        return customer.wishlist;
    }

    async updateLoyaltyPoints(customerId, points) {
        const customer = await Customer.findByIdAndUpdate(
            customerId,
            { $inc: { loyaltyPoints: points } },
            { new: true }
        );

        if (!customer) {
            throw new NotFoundError('Customer not found');
        }

        return customer;
    }
}

module.exports = new CustomerService();