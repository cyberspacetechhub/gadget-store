const addressService = require('../services/address/addressService');
const APIResponse = require('../utils/APIResponse');
const catchAsync = require('../utils/catchAsync');

const createAddress = catchAsync(async (req, res) => {
    const address = await addressService.createAddress(req.body, req.user.id);
    APIResponse.success(res, address, 'Address created successfully', 201);
});

const getUserAddresses = catchAsync(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const result = await addressService.getUserAddresses(req.user.id, page, limit);
    APIResponse.success(res, result, 'Addresses retrieved successfully');
});

const getAddressById = catchAsync(async (req, res) => {
    const address = await addressService.getAddressById(req.params.id, req.user.id);
    APIResponse.success(res, address, 'Address retrieved successfully');
});

const updateAddress = catchAsync(async (req, res) => {
    const address = await addressService.updateAddress(req.params.id, req.body, req.user.id);
    APIResponse.success(res, address, 'Address updated successfully');
});

const deleteAddress = catchAsync(async (req, res) => {
    await addressService.deleteAddress(req.params.id, req.user.id);
    APIResponse.success(res, null, 'Address deleted successfully');
});

const setDefaultAddress = catchAsync(async (req, res) => {
    const address = await addressService.setDefaultAddress(req.params.id, req.user.id);
    APIResponse.success(res, address, 'Default address set successfully');
});

const getDefaultAddress = catchAsync(async (req, res) => {
    const address = await addressService.getDefaultAddress(req.user.id);
    APIResponse.success(res, address, 'Default address retrieved successfully');
});

module.exports = {
    createAddress,
    getUserAddresses,
    getAddressById,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    getDefaultAddress
};