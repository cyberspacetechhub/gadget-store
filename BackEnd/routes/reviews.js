const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const verifyJWT = require('../middleware/verifyJWT');
const verifyRoles = require('../middleware/verifyRoles');
const ROLES_LIST = require('../config/rolesList');

// Public routes
router.get('/product/:productId', reviewController.getProductReviews);
router.get('/product/:productId/stats', reviewController.getReviewStats);
router.get('/:id', reviewController.getReviewById);

// Authenticated routes
router.use(verifyJWT);
router.post('/', reviewController.createReview);
router.get('/user/my-reviews', reviewController.getUserReviews);
router.put('/:id', reviewController.updateReview);
router.delete('/:id', reviewController.deleteReview);
router.post('/:id/vote', reviewController.voteReview);

// Admin routes
router.patch('/:id/approve', verifyRoles(ROLES_LIST.Admin), reviewController.approveReview);
router.post('/:id/admin-response', verifyRoles(ROLES_LIST.Admin), reviewController.addAdminResponse);

module.exports = router;