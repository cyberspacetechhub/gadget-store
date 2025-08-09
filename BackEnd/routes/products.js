const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { uploadProductImages } = require('../helpers/imageUpload');
const verifyJWT = require('../middleware/verifyJWT');
const verifyRoles = require('../middleware/verifyRoles');
const ROLES_LIST = require('../config/rolesList');

// Public routes
router.get('/', productController.getProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/search', productController.searchProducts);
router.get('/compare', productController.getComparisonData);
router.get('/category/:categoryId', productController.getProductsByCategory);
router.get('/:id', productController.getProduct);

// Protected routes (require authentication)
router.use(verifyJWT);

// Admin and Vendor can create products
router.post('/', 
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Vendor),
    uploadProductImages,
    productController.createProduct
);

// Admin and Vendor can update/delete products
router.put('/:id', 
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Vendor),
    uploadProductImages,
    productController.updateProduct
);

router.delete('/:id', 
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Vendor), 
    productController.deleteProduct
);

module.exports = router;