const productService = require('../services/product/productService');
const APIResponse = require('../utils/APIResponse');
const catchAsync = require('../utils/catchAsync');

// Get all products with filtering, sorting, and pagination
const getProducts = catchAsync(async (req, res) => {
    const {
        page = 1,
        limit = 12,
        category,
        brand,
        minPrice,
        maxPrice,
        rating,
        search,
        sort = '-createdAt'
    } = req.query;

    const filters = {
        category,
        brand,
        minPrice,
        maxPrice,
        rating,
        search
    };

    const { products, total } = await productService.getProducts(filters, page, limit, sort);

    APIResponse.paginated(res, products, Number(page), Number(limit), total, 'Products retrieved successfully');
});

// Get single product by ID or slug
const getProduct = catchAsync(async (req, res) => {
    const { id } = req.params;
    
    const product = await productService.getProductById(id);

    APIResponse.success(res, product, 'Product retrieved successfully');
});

// Create new product
const createProduct = catchAsync(async (req, res) => {
    const productData = req.body;
    const userId = req.roles.includes(1984) ? req.userId : null; // Vendor check
    
    // Handle uploaded images
    if (req.files) {
        if (req.files.coverImage && req.files.coverImage[0]) {
            productData.coverImage = {
                url: req.files.coverImage[0].path,
                alt: productData.name
            };
        }
        
        if (req.files.images && req.files.images.length > 0) {
            productData.images = req.files.images.map(file => ({
                url: file.path,
                alt: productData.name
            }));
        }
    }
    
    const product = await productService.createProduct(productData, userId);

    APIResponse.success(res, product, 'Product created successfully', 201);
});

// Update product
const updateProduct = catchAsync(async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    
    // Handle uploaded images
    if (req.files) {
        if (req.files.coverImage && req.files.coverImage[0]) {
            updates.coverImage = {
                url: req.files.coverImage[0].path,
                alt: updates.name || 'Product image'
            };
        }
        
        if (req.files.images && req.files.images.length > 0) {
            updates.images = req.files.images.map(file => ({
                url: file.path,
                alt: updates.name || 'Product image'
            }));
        }
    }
    
    const product = await productService.updateProduct(id, updates, req.userId, req.roles);

    APIResponse.success(res, product, 'Product updated successfully');
});

// Delete product
const deleteProduct = catchAsync(async (req, res) => {
    const { id } = req.params;
    
    await productService.deleteProduct(id, req.userId, req.roles);

    APIResponse.success(res, null, 'Product deleted successfully');
});

// Get products by category
const getProductsByCategory = catchAsync(async (req, res) => {
    const { categoryId } = req.params;
    const { page = 1, limit = 12, sort = '-createdAt' } = req.query;

    const { products, total } = await productService.getProductsByCategory(categoryId, page, limit, sort);

    APIResponse.paginated(res, products, Number(page), Number(limit), total, 'Products retrieved successfully');
});

// Get featured products
const getFeaturedProducts = catchAsync(async (req, res) => {
    const { limit = 8 } = req.query;

    const products = await productService.getFeaturedProducts(limit);

    APIResponse.success(res, products, 'Featured products retrieved successfully');
});

// Search products with suggestions
const searchProducts = catchAsync(async (req, res) => {
    const { q, limit = 10 } = req.query;

    const result = await productService.searchProducts(q, limit);

    APIResponse.success(res, result, 'Search results retrieved successfully');
});

// Get product comparison data
const getComparisonData = catchAsync(async (req, res) => {
    const { ids } = req.query;
    const productIds = ids ? ids.split(',') : [];

    const products = await productService.getComparisonData(productIds);

    APIResponse.success(res, products, 'Comparison data retrieved successfully');
});

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductsByCategory,
    getFeaturedProducts,
    searchProducts,
    getComparisonData
};