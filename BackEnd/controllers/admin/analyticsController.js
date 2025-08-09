const analyticsService = require('../../services/admin/analyticsService');
const catchAsync = require('../../utils/catchAsync');

const getDashboardAnalytics = catchAsync(async (req, res) => {
    const { timeRange = '30d' } = req.query;
    const analytics = await analyticsService.getDashboardAnalytics(timeRange);
    
    res.json({
        success: true,
        data: analytics,
        message: 'Dashboard analytics retrieved successfully'
    });
});

const getSalesAnalytics = catchAsync(async (req, res) => {
    const { timeRange = '30d' } = req.query;
    const analytics = await analyticsService.getSalesAnalytics(timeRange);
    
    res.json({
        success: true,
        data: analytics,
        message: 'Sales analytics retrieved successfully'
    });
});

const getProductAnalytics = catchAsync(async (req, res) => {
    const { timeRange = '30d' } = req.query;
    const analytics = await analyticsService.getProductAnalytics(timeRange);
    
    res.json({
        success: true,
        data: analytics,
        message: 'Product analytics retrieved successfully'
    });
});

const getCustomerAnalytics = catchAsync(async (req, res) => {
    const { timeRange = '30d' } = req.query;
    const analytics = await analyticsService.getCustomerAnalytics(timeRange);
    
    res.json({
        success: true,
        data: analytics,
        message: 'Customer analytics retrieved successfully'
    });
});

module.exports = {
    getDashboardAnalytics,
    getSalesAnalytics,
    getProductAnalytics,
    getCustomerAnalytics
};