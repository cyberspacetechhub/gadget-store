import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  MagnifyingGlassIcon 
} from '@heroicons/react/24/outline';
import { useQuery } from 'react-query';
import usePost from '../../../hooks/usePost';
import { useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import useAuth from '../../../hooks/useAuth';
import useFetch from '../../../hooks/useFetch';

const CategoryList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const postData = usePost();
  const queryClient = useQueryClient();
  const { auth } = useAuth();
  const fetch = useFetch();

  const { data, isLoading, error } = useQuery(
    ['categories'],
    async () => {
      const result = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3500/api/'}categories`, auth.accessToken);
      console.log("categories:", result);
      // Handle different response structures
      const categories = result.data?.data?.categories || result.data?.categories || result.data || [];
      return Array.isArray(categories) ? categories : [];
    },
    { enabled: !!auth.accessToken }
  );

  const categories = data || [];
  const filteredCategories = categories
    .filter(category => category?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  const handleDelete = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      await postData(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3500/api/'}categories/${categoryId}`,
        {},
        auth.accessToken,
        'DELETE'
      );
      
      queryClient.invalidateQueries(['categories']);
      toast.success('Category deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete category');
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
        <p className="text-red-600">Error loading categories: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <Link
          to="/admin/categories/create"
          className="flex items-center px-4 py-2 space-x-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add Category</span>
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute w-5 h-5 text-gray-400 left-3 top-3" />
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Categories Table */}
      <div className="overflow-hidden bg-white rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Category
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Description
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Sort Order
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Products Count
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCategories.map((category) => (
              <tr key={category._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                      <span className="text-lg font-semibold text-blue-600">
                        {category.name?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {category.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {category.description || 'No description'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {category.sortOrder || 0}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {category.productCount || 0}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                  <div className="flex justify-end space-x-2">
                    <Link
                      to={`/admin/categories/${category._id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </Link>
                    <Link
                      to={`/admin/categories/${category._id}/edit`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(category._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredCategories.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-gray-500">No categories found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryList;