const adminService = require('../../services/user/adminService');
const APIResponse = require('../../utils/APIResponse');
const catchAsync = require('../../utils/catchAsync');

// Get dashboard statistics
const getDashboardStats = catchAsync(async (req, res) => {
    console.log('Admin dashboard stats requested by user:', req.userId);
    const stats = await adminService.getDashboardStats();
    console.log('Sending dashboard stats:', stats);
    
    res.json({
        success: true,
        data: stats,
        message: 'Dashboard statistics retrieved successfully'
    });
});

// Get analytics data
const getAnalytics = catchAsync(async (req, res) => {
    const { timeRange = '30d' } = req.query;
    const analytics = await adminService.getAnalytics(timeRange);
    
    res.json({
        success: true,
        data: analytics,
        message: 'Analytics data retrieved successfully'
    });
});

// Get all customers
const getAllCustomers = catchAsync(async (req, res) => {
    console.log('Admin customers requested by user:', req.userId);
    const { page = 1, limit = 10, search, status } = req.query;
    
    const filters = {};
    if (search) {
        filters.$or = [
            { firstName: new RegExp(search, 'i') },
            { lastName: new RegExp(search, 'i') },
            { email: new RegExp(search, 'i') },
            { username: new RegExp(search, 'i') }
        ];
    }
    if (status !== undefined) {
        filters.isActive = status === 'active';
    }

    const { customers, total } = await adminService.getAllCustomers(page, limit, filters);
    console.log('Sending customers:', customers.length, 'Total:', total);
    
    res.json({
        success: true,
        data: { users: customers, total },
        message: 'Customers retrieved successfully'
    });
});

// Get single customer
const getCustomer = catchAsync(async (req, res) => {
    const customer = await adminService.getCustomerById(req.params.id);
    res.json({
        success: true,
        data: customer,
        message: 'Customer retrieved successfully'
    });
});

// Update customer
const updateCustomer = catchAsync(async (req, res) => {
    const customer = await adminService.updateCustomer(req.params.id, req.body);
    res.json({
        success: true,
        data: customer,
        message: 'Customer updated successfully'
    });
});

// Delete customer
const deleteCustomer = catchAsync(async (req, res) => {
    await adminService.deleteCustomer(req.params.id);
    res.json({
        success: true,
        message: 'Customer deleted successfully'
    });
});

// Toggle customer status
const toggleCustomerStatus = catchAsync(async (req, res) => {
    const { isActive } = req.body;
    const customer = await adminService.updateCustomerStatus(req.params.id, isActive);
    res.json({
        success: true,
        data: customer,
        message: 'Customer status updated successfully'
    });
});

// Update customer status
const updateCustomerStatus = catchAsync(async (req, res) => {
    const { customerId } = req.params;
    const { isActive } = req.body;
    
    const customer = await adminService.updateCustomerStatus(customerId, isActive);
    
    APIResponse.success(res, {
        id: customer._id,
        username: customer.username,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
        isActive: customer.isActive
    }, `Customer ${isActive ? 'activated' : 'deactivated'} successfully`);
});

// Create new admin
const createAdmin = catchAsync(async (req, res) => {
    const { username, email, password, firstName, lastName, permissions } = req.body;
    
    const admin = await adminService.createAdmin({
        username,
        email,
        password,
        firstName,
        lastName,
        permissions,
    });

    APIResponse.success(res, {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        permissions: admin.permissions,
        department: admin.department
    }, 'Admin created successfully', 201);
});

// Update admin permissions
const updatePermissions = catchAsync(async (req, res) => {
    const { adminId } = req.params;
    const { permissions } = req.body;
    
    const admin = await adminService.updatePermissions(adminId, permissions);
    
    APIResponse.success(res, {
        id: admin._id,
        username: admin.username,
        permissions: admin.permissions
    }, 'Permissions updated successfully');
});

// Get admin profile
const getProfile = catchAsync(async (req, res) => {
    const admin = await adminService.getAdminById(req.userId);
    
    APIResponse.success(res, {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        phone: admin.phone,
        permissions: admin.permissions,
        isSuper: admin.isSuper,
        lastLogin: admin.lastLogin
    }, 'Admin profile retrieved successfully');
});

// Update admin profile
const updateProfile = catchAsync(async (req, res) => {
    const { firstName, lastName, email, phone, username } = req.body;
    
    const admin = await adminService.updateAdmin(req.userId, {
        firstName,
        lastName,
        email,
        phone,
        username
    });
    
    APIResponse.success(res, {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        phone: admin.phone
    }, 'Profile updated successfully');
});

// Change password
const changePassword = catchAsync(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    
    await adminService.changePassword(req.userId, currentPassword, newPassword);
    
    APIResponse.success(res, null, 'Password changed successfully');
});

module.exports = {
    getDashboardStats,
    getAnalytics,
    getAllCustomers,
    getCustomer,
    updateCustomer,
    deleteCustomer,
    toggleCustomerStatus,
    updateCustomerStatus,
    createAdmin,
    updatePermissions,
    getProfile,
    updateProfile,
    changePassword
};