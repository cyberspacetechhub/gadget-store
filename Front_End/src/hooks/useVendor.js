import { useQuery, useMutation, useQueryClient } from 'react-query';
import { vendorAPI } from '../services/api';
import toast from 'react-hot-toast';

// Query keys
export const VENDOR_QUERY_KEYS = {
  all: ['vendor'],
  dashboard: () => [...VENDOR_QUERY_KEYS.all, 'dashboard'],
  products: (filters) => [...VENDOR_QUERY_KEYS.all, 'products', { filters }],
  orders: (filters) => [...VENDOR_QUERY_KEYS.all, 'orders', { filters }],
  analytics: (params) => [...VENDOR_QUERY_KEYS.all, 'analytics', { params }],
};

// Get dashboard stats
export const useVendorDashboard = () => {
  return useQuery({
    queryKey: VENDOR_QUERY_KEYS.dashboard(),
    queryFn: () => vendorAPI.getDashboardStats(),
    select: (data) => data.data,
  });
};

// Get vendor products
export const useVendorProducts = (params = {}) => {
  return useQuery({
    queryKey: VENDOR_QUERY_KEYS.products(params),
    queryFn: () => vendorAPI.getProducts(params),
    select: (data) => data.data,
  });
};

// Get vendor orders
export const useVendorOrders = (params = {}) => {
  return useQuery({
    queryKey: VENDOR_QUERY_KEYS.orders(params),
    queryFn: () => vendorAPI.getOrders(params),
    select: (data) => data.data,
  });
};

// Get vendor analytics
export const useVendorAnalytics = (params = {}) => {
  return useQuery({
    queryKey: VENDOR_QUERY_KEYS.analytics(params),
    queryFn: () => vendorAPI.getAnalytics(params),
    select: (data) => data.data,
  });
};

// Update order status mutation
export const useVendorUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => vendorAPI.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(VENDOR_QUERY_KEYS.all);
      toast.success('Order status updated successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update order status');
    },
  });
};

// Update vendor profile mutation
export const useUpdateVendorProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: vendorAPI.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries(VENDOR_QUERY_KEYS.all);
      toast.success('Profile updated successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    },
  });
};