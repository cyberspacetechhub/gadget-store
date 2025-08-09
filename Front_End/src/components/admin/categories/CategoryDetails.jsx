import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  PencilIcon, 
  TrashIcon 
} from '@heroicons/react/24/outline';
import { useQuery } from 'react-query';
import usePost from '../../../hooks/usePost';
import { useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import useAuth from '../../../hooks/useAuth';
import useFetch from '../../../hooks/useFetch';

const CategoryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const postData = usePost();
  const queryClient = useQueryClient();
  const { auth } = useAuth();
  const fetch = useFetch();

  const { data: category, isLoading, error } = useQuery(
    ['category', id],
    async () => {
      const result = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3500/api/'}categories/${id}`, auth.accessToken);
      return result.data?.category || result.data || {};
    },
    { enabled: !!id && !!auth.accessToken }
  );

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      await postData(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3500/api/'}categories/${id}`,
        {},
        auth.accessToken,
        'DELETE'
      );
      
      queryClient.invalidateQueries(['categories']);
      toast.success('Category deleted successfully');
      navigate('/admin/categories');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete category');
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

  if (!category) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Category not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin/categories')}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Category Details</h1>
        </div>
        
        <div className="flex space-x-3">
          <Link
            to={`/admin/categories/${id}/edit`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <PencilIcon className="h-4 w-4" />
            <span>Edit</span>
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-2"
          >
            <TrashIcon className="h-4 w-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Category Details */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="space-y-6">
            {/* Category Icon and Name */}
            <div className="flex items-center space-x-6">
              <div className="h-20 w-20 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold text-3xl">
                  {category.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{category.name}</h2>
                <p className="text-lg text-gray-600 mt-2">Category</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {category.description || 'No description provided'}
              </p>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Products Count</h4>
                <p className="text-2xl font-bold text-blue-600">
                  {category.productCount || 0}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Sort Order</h4>
                <p className="text-2xl font-bold text-green-600">
                  {category.sortOrder || 0}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Created</h4>
                <p className="text-gray-600">
                  {category.createdAt ? new Date(category.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Last Updated</h4>
                <p className="text-gray-600">
                  {category.updatedAt ? new Date(category.updatedAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Category ID</h4>
                  <p className="text-gray-600 text-sm font-mono">{category._id}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Status</h4>
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryDetails;