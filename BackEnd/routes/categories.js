const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const verifyJWT = require('../middleware/verifyJWT');
const verifyRoles = require('../middleware/verifyRoles');
const ROLES_LIST = require('../config/rolesList');

// Public routes
router.get('/', categoryController.getCategories);
router.get('/main', categoryController.getMainCategories);
router.get('/:id', categoryController.getCategoryById);
router.get('/slug/:slug', categoryController.getCategoryBySlug);
router.get('/:parentId/subcategories', categoryController.getSubcategories);

// Admin routes
// router.use(verifyJWT);
// router.use(verifyRoles(ROLES_LIST.Admin));
router.post('/', categoryController.createCategory);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;