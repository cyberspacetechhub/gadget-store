const reviewService = require('../services/review/reviewService');
const APIResponse = require('../utils/APIResponse');
const catchAsync = require('../utils/catchAsync');

const createReview = catchAsync(async (req, res) => {
    const review = await reviewService.createReview(req.body, req.user.id);
    APIResponse.success(res, review, 'Review created successfully', 201);
});

const getProductReviews = catchAsync(async (req, res) => {
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;
    const result = await reviewService.getProductReviews(req.params.productId, page, limit, sort);
    APIResponse.success(res, result, 'Product reviews retrieved successfully');
});

const getUserReviews = catchAsync(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const result = await reviewService.getUserReviews(req.user.id, page, limit);
    APIResponse.success(res, result, 'User reviews retrieved successfully');
});

const getReviewById = catchAsync(async (req, res) => {
    const review = await reviewService.getReviewById(req.params.id);
    APIResponse.success(res, review, 'Review retrieved successfully');
});

const updateReview = catchAsync(async (req, res) => {
    const review = await reviewService.updateReview(req.params.id, req.body, req.user.id);
    APIResponse.success(res, review, 'Review updated successfully');
});

const deleteReview = catchAsync(async (req, res) => {
    await reviewService.deleteReview(req.params.id, req.user.id);
    APIResponse.success(res, null, 'Review deleted successfully');
});

const voteReview = catchAsync(async (req, res) => {
    const { voteType } = req.body;
    const review = await reviewService.voteReview(req.params.id, req.user.id, voteType);
    APIResponse.success(res, review, 'Vote recorded successfully');
});

const approveReview = catchAsync(async (req, res) => {
    const { isApproved } = req.body;
    const review = await reviewService.approveReview(req.params.id, isApproved);
    APIResponse.success(res, review, 'Review approval status updated successfully');
});

const addAdminResponse = catchAsync(async (req, res) => {
    const { message } = req.body;
    const review = await reviewService.addAdminResponse(req.params.id, message, req.user.id);
    APIResponse.success(res, review, 'Admin response added successfully');
});

const getReviewStats = catchAsync(async (req, res) => {
    const stats = await reviewService.getReviewStats(req.params.productId);
    APIResponse.success(res, stats, 'Review statistics retrieved successfully');
});

module.exports = {
    createReview,
    getProductReviews,
    getUserReviews,
    getReviewById,
    updateReview,
    deleteReview,
    voteReview,
    approveReview,
    addAdminResponse,
    getReviewStats
};