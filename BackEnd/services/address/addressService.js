const Address = require('../../models/Address');
const { ValidationError, NotFoundError } = require('../../utils/customErrors');

class AddressService {
    async createAddress(addressData, userId) {
        const address = await Address.create({
            ...addressData,
            user: userId
        });
        return address;
    }

    async getUserAddresses(userId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const filter = { user: userId };
        
        const addresses = await Address.find(filter)
            .sort('-isDefault -createdAt')
            .skip(skip)
            .limit(Number(limit));
            
        const total = await Address.countDocuments(filter);
        return { addresses, total };
    }

    async getAddressById(id, userId) {
        const address = await Address.findOne({ _id: id, user: userId });
        if (!address) {
            throw new NotFoundError('Address not found');
        }
        return address;
    }

    async updateAddress(id, updateData, userId) {
        const address = await Address.findOneAndUpdate(
            { _id: id, user: userId },
            updateData,
            { new: true, runValidators: true }
        );
        
        if (!address) {
            throw new NotFoundError('Address not found');
        }
        return address;
    }

    async deleteAddress(id, userId) {
        const address = await Address.findOne({ _id: id, user: userId });
        if (!address) {
            throw new NotFoundError('Address not found');
        }

        if (address.isDefault) {
            throw new ValidationError('Cannot delete default address');
        }

        await Address.findByIdAndDelete(id);
        return true;
    }

    async setDefaultAddress(id, userId) {
        const address = await Address.findOne({ _id: id, user: userId });
        if (!address) {
            throw new NotFoundError('Address not found');
        }

        // Remove default from other addresses
        await Address.updateMany(
            { user: userId },
            { isDefault: false }
        );

        // Set this address as default
        address.isDefault = true;
        await address.save();
        
        return address;
    }

    async getDefaultAddress(userId) {
        const address = await Address.findOne({ user: userId, isDefault: true });
        return address;
    }
}

module.exports = new AddressService();