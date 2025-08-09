const Product = require('../../models/Product');
const Category = require('../../models/Category');
const { ValidationError, NotFoundError } = require('../../utils/customErrors');

class ProductService {
    async createProduct(productData, userId = null) {
        // Check if category exists
        const categoryExists = await Category.findById(productData.category);
        if (!categoryExists) {
            throw new ValidationError('Invalid category');
        }

        // Check if SKU already exists
        const existingSku = await Product.findOne({ sku: productData.sku });
        if (existingSku) {
            throw new ValidationError('SKU already exists');
        }

        const product = await Product.create({
            ...productData,
            vendor: userId,
            isVendorProduct: !!userId
        });

        await product.populate('category', 'name slug');
        return product;
    }

    async getProducts(filters = {}, page = 1, limit = 12, sort = '-createdAt') {
        const skip = (page - 1) * limit;
        
        // Build filter object
        const query = { status: { $in: ['Available', 'Active'] } };

        if (filters.category) {
            query.category = filters.category;
        }

        if (filters.brand) {
            query.brand = new RegExp(filters.brand, 'i');
        }

        if (filters.minPrice || filters.maxPrice) {
            query.price = {};
            if (filters.minPrice) query.price.$gte = Number(filters.minPrice);
            if (filters.maxPrice) query.price.$lte = Number(filters.maxPrice);
        }

        if (filters.rating) {
            query.averageRating = { $gte: Number(filters.rating) };
        }

        if (filters.search) {
            query.$text = { $search: filters.search };
        }
        
        const products = await Product.find(query)
            .populate('category', 'name slug')
            // .populate('username firstName lastName')
            .sort(sort)
            .skip(skip)
            .limit(Number(limit))
            .lean();

        const total = await Product.countDocuments(query);
        return { products, total };
    }

    async getProductById(id) {
        let product = await Product.findById(id)
            .populate('category', 'name slug')
            // .populate('vendor', 'username firstName lastName email');

        if (!product) {
            product = await Product.findOne({ slug: id })
                .populate('category', 'name slug')
                // .populate('vendor', 'username firstName lastName email');
        }

        if (!product) {
            throw new NotFoundError('Product not found');
        }

        // Increment view count
        await Product.findByIdAndUpdate(product._id, { $inc: { viewCount: 1 } });

        return product;
    }

    async updateProduct(id, updateData, userId = null) {
        const product = await Product.findById(id);
        if (!product) {
            throw new NotFoundError('Product not found');
        }

        // Check permissions for vendor
        // if (userRoles.includes(1984) && product.vendor?.toString() !== userId) {
        //     throw new ValidationError('You can only update your own products');
        // }

        // Validate category if updating
        if (updateData.category) {
            const categoryExists = await Category.findById(updateData.category);
            if (!categoryExists) {
                throw new ValidationError('Invalid category');
            }
        }

        // Check SKU uniqueness if updating
        if (updateData.sku && updateData.sku !== product.sku) {
            const existingSku = await Product.findOne({ sku: updateData.sku });
            if (existingSku) {
                throw new ValidationError('SKU already exists');
            }
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('category', 'name slug');

        return updatedProduct;
    }

    async deleteProduct(id, userId = null, userRoles = []) {
        const product = await Product.findById(id);
        if (!product) {
            throw new NotFoundError('Product not found');
        }

        // Check permissions for vendor
        // if (userRoles.includes(1984) && product.vendor?.toString() !== userId) {
        //     throw new ValidationError('You can only delete your own products');
        // }

        await Product.findByIdAndDelete(id);
        return true;
    }

    async getProductsByCategory(categoryId, page = 1, limit = 12, sort = '-createdAt') {
        const category = await Category.findById(categoryId);
        if (!category) {
            throw new NotFoundError('Category not found');
        }

        const skip = (page - 1) * limit;
        const products = await Product.find({ category: categoryId, status: { $in: ['Available', 'Active'] } })
            .populate('category', 'name slug')
            .sort(sort)
            .skip(skip)
            .limit(Number(limit));

        const total = await Product.countDocuments({ category: categoryId, status: { $in: ['Available', 'Active'] } });

        return { products, total };
    }

    async getFeaturedProducts(limit = 8) {
        const products = await Product.find({ isFeatured: true, status: { $in: ['Available', 'Active'] } })
            .populate('category', 'name slug')
            .sort('-createdAt')
            .limit(Number(limit));

        return products;
    }

    async searchProducts(query, limit = 10) {
        if (!query) {
            throw new ValidationError('Search query is required');
        }

        // Text search
        const products = await Product.find({
            $text: { $search: query },
            status: { $in: ['Available', 'Active'] }
        })
        .populate('category', 'name slug')
        .limit(Number(limit))
        .lean();

        // Get search suggestions
        const brands = await Product.distinct('brand', {
            brand: new RegExp(query, 'i'),
            status: { $in: ['Available', 'Active'] }
        });

        const categories = await Category.find({
            name: new RegExp(query, 'i'),
            isActive: true
        }).select('name slug').limit(5);

        return {
            products,
            suggestions: {
                brands: brands.slice(0, 5),
                categories
            }
        };
    }

    async getComparisonData(ids) {
        if (!ids || !Array.isArray(ids)) {
            throw new ValidationError('Product IDs are required');
        }

        const productIds = ids.slice(0, 3); // Limit to 3 products

        const products = await Product.find({
            _id: { $in: productIds },
            status: { $in: ['Available', 'Active'] }
        })
        .populate('category', 'name slug')
        .select('name images price comparePrice brand model specifications averageRating totalReviews');

        if (products.length === 0) {
            throw new NotFoundError('No products found for comparison');
        }

        return products;
    }

    async updateStock(productId, quantity) {
        const product = await Product.findById(productId);
        if (!product) {
            throw new NotFoundError('Product not found');
        }

        product.stock.quantity = quantity;
        if (product.stock.trackStock && quantity === 0) {
            product.status = 'Out-of-Stock';
        } else if (product.status === 'Out-of-Stock' && quantity > 0) {
            product.status = 'Active';
        }

        await product.save();
        return product;
    }
}

module.exports = new ProductService();