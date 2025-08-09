import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useProduct } from '../../../hooks/useProducts';
import { useQuery } from 'react-query';
import usePost from '../../../hooks/usePost';
import { useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import useAuth from '../../../hooks/useAuth';
import useFetch from '../../../hooks/useFetch';

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const postData = usePost();
  const queryClient = useQueryClient();
  const { auth } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: product, isLoading, error } = useProduct(id);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const fetch = useFetch();

  const { data: categoriesData } = useQuery(
    ['categories'],
    async () => {
      const result = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3500/api/'}categories`, auth.accessToken);
      const categories = result.data?.data?.categories || result.data?.categories || result.data || [];
      return Array.isArray(categories) ? categories : [];
    },
    { enabled: !!auth.accessToken }
  );

  const categories = categoriesData || [];

  useEffect(() => {
    if (product) {
      reset({
        name: product.name || '',
        brand: product.brand || '',
        sku: product.sku || '',
        category: product.category?._id || product.category || '',
        price: product.price || '',
        stockQuantity: product.stock?.quantity || '',
        description: product.description || '',
        images: product.images?.map(img => img.url || img).join(', ') || '',
        specifications: product.specifications ? JSON.stringify(product.specifications, null, 2) : ''
      });
    }
  }, [product, reset]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      const productData = {
        name: data.name,
        brand: data.brand,
        sku: data.sku,
        category: data.category,
        price: parseFloat(data.price),
        description: data.description,
        stock: {
          quantity: parseInt(data.stockQuantity)
        },
        specifications: data.specifications ? 
          (() => {
            try {
              const parsed = JSON.parse(data.specifications);
              return Array.isArray(parsed) ? parsed.map(spec => ({
                name: spec.name,
                value: spec.value
              })) : [];
            } catch {
              return [];
            }
          })() : [],
        images: data.images ? 
          data.images.split(',').map(img => ({
            url: img.trim(),
            alt: data.name
          })) : []
      };

      await postData(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3500/api/'}products/${id}`,
        productData,
        auth.accessToken,
        'PUT'
      );

      queryClient.invalidateQueries(['products']);
      queryClient.invalidateQueries(['product', id]);
      toast.success('Product updated successfully');
      navigate('/admin/products');
    } catch (error) {
      console.error('Product update error:', error);
      if (error.response?.status === 403) {
        toast.error('Access denied. Please login again.');
        navigate('/login');
      } else {
        toast.error(error.response?.data?.message || 'Failed to update product');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-red-600">Error loading product: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/admin/products')}
          className="p-2 text-gray-400 hover:text-gray-600"
        >
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Product Name */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Product Name *
              </label>
              <input
                type="text"
                {...register('name', { required: 'Product name is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter product name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Brand */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Brand *
              </label>
              <input
                type="text"
                {...register('brand', { required: 'Brand is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter brand name"
              />
              {errors.brand && (
                <p className="mt-1 text-sm text-red-600">{errors.brand.message}</p>
              )}
            </div>

            {/* SKU */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                SKU *
              </label>
              <input
                type="text"
                {...register('sku', { required: 'SKU is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter SKU"
              />
              {errors.sku && (
                <p className="mt-1 text-sm text-red-600">{errors.sku.message}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Category *
              </label>
              <select
                {...register('category', { required: 'Category is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select category</option>
                {categories.map(category => (
                  <option key={category._id} value={category._id}>{category.name}</option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Price ($) *
              </label>
              <input
                type="number"
                step="0.01"
                {...register('price', { 
                  required: 'Price is required',
                  min: { value: 0, message: 'Price must be positive' }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
              )}
            </div>

            {/* Stock */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Stock Quantity *
              </label>
              <input
                type="number"
                {...register('stockQuantity', { 
                  required: 'Stock quantity is required',
                  min: { value: 0, message: 'Stock must be non-negative' }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
              {errors.stockQuantity && (
                <p className="mt-1 text-sm text-red-600">{errors.stockQuantity.message}</p>
              )}
            </div>

            {/* Images */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Image URLs
              </label>
              <input
                type="text"
                {...register('images')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter image URLs separated by commas"
              />
              <p className="mt-1 text-xs text-gray-500">
                Separate multiple URLs with commas
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Description *
            </label>
            <textarea
              {...register('description', { required: 'Description is required' })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter product description"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Specifications */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Specifications (JSON)
            </label>
            <textarea
              {...register('specifications')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="[{'name': 'Color', 'value': 'Black'}, {'name': 'Weight', 'value': '1.5kg'}]"
            />
            <p className="mt-1 text-xs text-gray-500">
              Enter as array of objects: {'[{"name": "Color", "value": "Black"}]'}
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Updating...' : 'Update Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductEdit;