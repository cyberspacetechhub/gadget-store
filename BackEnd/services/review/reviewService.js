const Review = require('../../models/Review');
const Order = require('../../models/Order');
const { ValidationError, NotFoundError } = require('../../utils/customErrors');

class ReviewService {
    async createReview(reviewData, userId) {
        // Check if user has purchased the product
        const hasPurchased = await Order.findOne({
            user: userId,
            'items.product': reviewData.product,
            paymentStatus: 'paid'
        });

        const review = await Review.create({
            ...reviewData,
            user: userId,
            isVerifiedPurchase: !!hasPurchased
        });

        return await review.populate('user', 'firstName lastName');
    }

    async getProductReviews(productId, page = 1, limit = 10, sort = '-createdAt') {
        const skip = (page - 1) * limit;
        
        const reviews = await Review.find({ 
            product: productId, 
            isApproved: true 
        })
        .populate('user', 'firstName lastName')
        .sort(sort)
        .skip(skip)
        .limit(Number(limit));

        const total = await Review.countDocuments({ 
            product: productId, 
            isApproved: true 
        });

        return { reviews, total };
    }

    async getUserReviews(userId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        
        const reviews = await Review.find({ user: userId })
            .populate('product', 'name images')
            .sort('-createdAt')
            .skip(skip)
            .limit(Number(limit));

        const total = await Review.countDocuments({ user: userId });
        return { reviews, total };
    }

    async getReviewById(id) {
        const review = await Review.findById(id)
            .populate('user', 'firstName lastName')
            .populate('product', 'name images');
        
        if (!review) {
            throw new NotFoundError('Review not found');
        }
        return review;
    }

    async updateReview(id, updateData, userId) {
        const review = await Review.findById(id);
        if (!review) {
            throw new NotFoundError('Review not found');
        }

        if (review.user.toString() !== userId) {
            throw new ValidationError('You can only update your own reviews');
        }

        const updatedReview = await Review.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('user', 'firstName lastName');

        return updatedReview;
    }

    async deleteReview(id, userId) {
        const review = await Review.findById(id);
        if (!review) {
            throw new NotFoundError('Review not found');
        }

        if (review.user.toString() !== userId) {
            throw new ValidationError('You can only delete your own reviews');
        }

        await Review.findByIdAndDelete(id);
        return true;
    }

    async voteReview(reviewId, userId, voteType) {
        const review = await Review.findById(reviewId);
        if (!review) {
            throw new NotFoundError('Review not found');
        }

        review.addVote(userId, voteType);
        await review.save();
        
        return review;
    }

    async approveReview(id, isApproved) {
        const review = await Review.findByIdAndUpdate(
            id,
            { isApproved },
            { new: true }
        );
        
        if (!review) {
            throw new NotFoundError('Review not found');
        }
        return review;
    }

    async addAdminResponse(id, message, adminId) {
        const review = await Review.findByIdAndUpdate(
            id,
            {
                adminResponse: {
                    message,
                    respondedBy: adminId,
                    respondedAt: new Date()
                }
            },
            { new: true }
        ).populate('user', 'firstName lastName');

        if (!review) {
            throw new NotFoundError('Review not found');
        }
        return review;
    }

    async getReviewStats(productId) {
        const stats = await Review.aggregate([
            { $match: { product: productId, isApproved: true } },
            {
                $group: {
                    _id: '$rating',
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: -1 } }
        ]);

        const totalReviews = stats.reduce((sum, stat) => sum + stat.count, 0);
        const averageRating = stats.reduce((sum, stat) => sum + (stat._id * stat.count), 0) / totalReviews;

        return {
            totalReviews,
            averageRating: Math.round(averageRating * 10) / 10,
            ratingBreakdown: stats
        };
    }
}

module.exports = new ReviewService();