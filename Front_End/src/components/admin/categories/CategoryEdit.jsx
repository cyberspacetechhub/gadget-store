import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useQuery } from 'react-query';
import usePost from '../../../hooks/usePost';
import { useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import useAuth from '../../../hooks/useAuth';
import useFetch from '../../../hooks/useFetch';

const CategoryEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const postData = usePost();
  const queryClient = useQueryClient();
  const { auth } = useAuth();
  const fetch = useFetch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: category, isLoading, error } = useQuery(
    ['category', id],
    async () => {
      const result = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3500/api/'}categories/${id}`, auth.accessToken);
      return result.data?.category || result.data || {};
    },
    { enabled: !!id && !!auth.accessToken }
  );

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    if (category) {
      reset({
        name: category.name || '',
        description: category.description || '',
        sortOrder: category.sortOrder || 0
      });
    }
  }, [category, reset]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      await postData(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3500/api/'}categories/${id}`,
        data,
        auth.accessToken,
        'PUT'
      );

      queryClient.invalidateQueries(['categories']);
      queryClient.invalidateQueries(['category', id]);
      toast.success('Category updated successfully');
      navigate('/admin/categories');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update category');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading category: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/admin/categories')}
          className="p-2 text-gray-400 hover:text-gray-600"
        >
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Edit Category</h1>
      </div>

      {/* Form */}
      <div className="bg-white shadow-sm rounded-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Category Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Name *
            </label>
            <input
              type="text"
              {...register('name', { required: 'Category name is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter category name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter category description"
            />
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort Order
            </label>
            <input
              type="number"
              {...register('sortOrder')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
            />
            <p className="mt-1 text-xs text-gray-500">
              Lower numbers appear first (0, 1, 2...)
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/admin/categories')}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Updating...' : 'Update Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryEdit;