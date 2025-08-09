import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useQuery } from 'react-query';
import usePost from '../../../hooks/usePost';
import { useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import useAuth from '../../../hooks/useAuth';
import useFetch from '../../../hooks/useFetch';
import ImageUpload from '../../common/ImageUpload';
import SpecificationInput from '../../common/SpecificationInput';

const ProductCreate = () => {
  const navigate = useNavigate();
  const postData = usePost();
  const queryClient = useQueryClient();
  const { auth } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [productImageUrls, setProductImageUrls] = useState([]);
  const [specifications, setSpecifications] = useState([]);

  const { register, handleSubmit, formState: { errors }, watch } = useForm();
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

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      
      // Add text fields
      formData.append('name', data.name);
      formData.append('brand', data.brand);
      formData.append('sku', data.sku);
      formData.append('category', data.category);
      formData.append('price', parseFloat(data.price));
      formData.append('description', data.description);
      formData.append('stock[quantity]', parseInt(data.stockQuantity));
      
      // Add specifications
      specifications.forEach((spec, index) => {
        if (spec.name && spec.value) {
          formData.append(`specifications[${index}][name]`, spec.name);
          formData.append(`specifications[${index}][value]`, spec.value);
        }
      });
      
      // Add cover image URL
      if (coverImageUrl) {
        formData.append('coverImage[url]', coverImageUrl);
      }
      
      // Add product image URLs
      productImageUrls.forEach((imageUrl, index) => {
        formData.append(`images[${index}][url]`, imageUrl);
      });
      
      const apiUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:3600/api/'}products`;
        
      const response = await window.fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${auth.accessToken}`
        },
        body: formData
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      queryClient.invalidateQueries(['products']);
      toast.success('Product created successfully');
      navigate('/admin/products');
    } catch (error) {
      if (error.message.includes('403') || error.message.includes('Access denied')) {
        toast.error('Access denied. Please login again.');
        navigate('/login');
      } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        toast.error('Session expired. Please login again.');
        navigate('/login');
      } else {
        toast.error(error.message || 'Failed to create product');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <h1 className="text-2xl font-bold text-gray-900">Create Product</h1>
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

          </div>

          {/* Cover Image Upload */}
          <ImageUpload
            label="Cover Image"
            name="coverImage"
            multiple={false}
            required={true}
            onFilesChange={(urls) => setCoverImageUrl(urls[0] || '')}
          />

          {/* Product Images Upload */}
          <ImageUpload
            label="Product Images"
            name="images"
            multiple={true}
            maxFiles={10}
            onFilesChange={setProductImageUrls}
          />

          <div className="grid grid-cols-1 gap-6">
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
          <SpecificationInput
            onSpecificationsChange={setSpecifications}
          />

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
              {isSubmitting ? 'Creating...' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductCreate;