const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5']
    },
    title: {
        type: String,
        required: [true, 'Review title is required'],
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    comment: {
        type: String,
        required: [true, 'Review comment is required'],
        maxlength: [1000, 'Comment cannot exceed 1000 characters']
    },
    images: [{
        url: String,
        alt: String
    }],
    isVerifiedPurchase: {
        type: Boolean,
        default: false
    },
    helpfulVotes: {
        type: Number,
        default: 0
    },
    votedBy: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        vote: {
            type: String,
            enum: ['helpful', 'not-helpful']
        }
    }],
    isApproved: {
        type: Boolean,
        default: true
    },
    adminResponse: {
        message: String,
        respondedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        respondedAt: Date
    }
}, {
    timestamps: true
});

// Compound index to ensure one review per user per product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Method to add helpful vote
reviewSchema.methods.addVote = function(userId, voteType) {
    const existingVote = this.votedBy.find(vote => 
        vote.user.toString() === userId.toString()
    );

    if (existingVote) {
        existingVote.vote = voteType;
    } else {
        this.votedBy.push({ user: userId, vote: voteType });
    }

    // Recalculate helpful votes
    this.helpfulVotes = this.votedBy.filter(vote => vote.vote === 'helpful').length;
};

// Static method to calculate average rating for a product
reviewSchema.statics.calcAverageRating = async function(productId) {
    const stats = await this.aggregate([
        { $match: { product: productId, isApproved: true } },
        {
            $group: {
                _id: '$product',
                averageRating: { $avg: '$rating' },
                totalReviews: { $sum: 1 }
            }
        }
    ]);

    if (stats.length > 0) {
        await this.model('Product').findByIdAndUpdate(productId, {
            averageRating: Math.round(stats[0].averageRating * 10) / 10,
            totalReviews: stats[0].totalReviews
        });
    } else {
        await this.model('Product').findByIdAndUpdate(productId, {
            averageRating: 0,
            totalReviews: 0
        });
    }
};

// Update product rating after save
reviewSchema.post('save', function() {
    this.constructor.calcAverageRating(this.product);
});

// Update product rating after remove
reviewSchema.post('remove', function() {
    this.constructor.calcAverageRating(this.product);
});

module.exports = mongoose.model('Review', reviewSchema);