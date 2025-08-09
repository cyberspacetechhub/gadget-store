const categoryService = require('../services/category/categoryService');
const APIResponse = require('../utils/APIResponse');
const catchAsync = require('../utils/catchAsync');

const createCategory = catchAsync(async (req, res) => {
    const category = await categoryService.createCategory(req.body);
    APIResponse.success(res, category, 'Category created successfully', 201);
});

const getCategories = catchAsync(async (req, res) => {
    const { includeInactive, page = 1, limit = 20 } = req.query;
    const result = await categoryService.getCategories(includeInactive === 'true', page, limit);
    APIResponse.success(res, result, 'Categories retrieved successfully');
});

const getCategoryById = catchAsync(async (req, res) => {
    const category = await categoryService.getCategoryById(req.params.id);
    APIResponse.success(res, category, 'Category retrieved successfully');
});

const getCategoryBySlug = catchAsync(async (req, res) => {
    const category = await categoryService.getCategoryBySlug(req.params.slug);
    APIResponse.success(res, category, 'Category retrieved successfully');
});

const updateCategory = catchAsync(async (req, res) => {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    APIResponse.success(res, category, 'Category updated successfully');
});

const deleteCategory = catchAsync(async (req, res) => {
    await categoryService.deleteCategory(req.params.id);
    APIResponse.success(res, null, 'Category deleted successfully');
});

const getMainCategories = catchAsync(async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    const result = await categoryService.getMainCategories(page, limit);
    APIResponse.success(res, result, 'Main categories retrieved successfully');
});

const getSubcategories = catchAsync(async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    const result = await categoryService.getSubcategories(req.params.parentId, page, limit);
    APIResponse.success(res, result, 'Subcategories retrieved successfully');
});

module.exports = {
    createCategory,
    getCategories,
    getCategoryById,
    getCategoryBySlug,
    updateCategory,
    deleteCategory,
    getMainCategories,
    getSubcategories
};