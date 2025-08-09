import { useQuery, useMutation, useQueryClient } from 'react-query';
import { categoriesAPI } from '../services/api';
import toast from 'react-hot-toast';

// Query keys
export const CATEGORIES_QUERY_KEYS = {
  all: ['categories'],
  lists: () => [...CATEGORIES_QUERY_KEYS.all, 'list'],
  list: (filters) => [...CATEGORIES_QUERY_KEYS.lists(), { filters }],
  details: () => [...CATEGORIES_QUERY_KEYS.all, 'detail'],
  detail: (id) => [...CATEGORIES_QUERY_KEYS.details(), id],
};

// Get categories
export const useCategories = (params = {}) => {
  return useQuery({
    queryKey: CATEGORIES_QUERY_KEYS.list(params),
    queryFn: () => categoriesAPI.getCategories(params),
    select: (data) => data.data,
  });
};

// Get single category
export const useCategory = (id) => {
  return useQuery({
    queryKey: CATEGORIES_QUERY_KEYS.detail(id),
    queryFn: () => categoriesAPI.getCategory(id),
    select: (data) => data.data,
    enabled: !!id,
  });
};

// Create category mutation
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoriesAPI.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(CATEGORIES_QUERY_KEYS.all);
      toast.success('Category created successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create category');
    },
  });
};

// Update category mutation
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => categoriesAPI.updateCategory(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(CATEGORIES_QUERY_KEYS.all);
      queryClient.invalidateQueries(CATEGORIES_QUERY_KEYS.detail(variables.id));
      toast.success('Category updated successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update category');
    },
  });
};

// Delete category mutation
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoriesAPI.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(CATEGORIES_QUERY_KEYS.all);
      toast.success('Category deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete category');
    },
  });
};