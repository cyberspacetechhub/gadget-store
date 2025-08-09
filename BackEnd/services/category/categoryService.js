const Category = require('../../models/Category');
const { ValidationError, NotFoundError } = require('../../utils/customErrors');

class CategoryService {
    async createCategory(categoryData) {
        const category = await Category.create(categoryData);
        return category;
    }

    async getCategories(includeInactive = false, page = 1, limit = 20) {
        const filter = includeInactive ? {} : { isActive: true };
        const skip = (page - 1) * limit;
        
        const categories = await Category.find(filter)
            .populate('subcategories')
            .sort('sortOrder name')
            .skip(skip)
            .limit(Number(limit));
            
        const total = await Category.countDocuments(filter);
        return { categories, total };
    }

    async getCategoryById(id) {
        const category = await Category.findById(id).populate('subcategories');
        if (!category) {
            throw new NotFoundError('Category not found');
        }
        return category;
    }

    async getCategoryBySlug(slug) {
        const category = await Category.findOne({ slug }).populate('subcategories');
        if (!category) {
            throw new NotFoundError('Category not found');
        }
        return category;
    }

    async updateCategory(id, updateData) {
        const category = await Category.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );
        if (!category) {
            throw new NotFoundError('Category not found');
        }
        return category;
    }

    async deleteCategory(id) {
        const category = await Category.findById(id);
        if (!category) {
            throw new NotFoundError('Category not found');
        }

        const subcategories = await Category.find({ parent: id });
        if (subcategories.length > 0) {
            throw new ValidationError('Cannot delete category with subcategories');
        }

        await Category.findByIdAndDelete(id);
        return true;
    }

    async getMainCategories(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const filter = { parent: null, isActive: true };
        
        const categories = await Category.find(filter)
            .sort('sortOrder name')
            .skip(skip)
            .limit(Number(limit));
            
        const total = await Category.countDocuments(filter);
        return { categories, total };
    }

    async getSubcategories(parentId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const filter = { parent: parentId, isActive: true };
        
        const subcategories = await Category.find(filter)
            .sort('sortOrder name')
            .skip(skip)
            .limit(Number(limit));
            
        const total = await Category.countDocuments(filter);
        return { subcategories, total };
    }
}

module.exports = new CategoryService();