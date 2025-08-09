import { useQuery } from 'react-query';
import useAuth from './useAuth';
import useFetch from './useFetch';
import usePost from './usePost';

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3600/api/';

// Get dashboard stats
export const useAdminDashboard = (options = {}) => {
  const { auth } = useAuth();
  const fetch = useFetch();

  return useQuery(
    ['admin-dashboard'],
    async () => {
      try {
        console.log('Fetching dashboard from:', `${baseUrl}admin/dashboard`);
        console.log('Auth token:', auth.accessToken ? 'Present' : 'Missing');
        const result = await fetch(`${baseUrl}admin/dashboard`, auth.accessToken);
        console.log('Dashboard API result:', result);
        return result.data?.data || result.data || {};
      } catch (error) {
        console.error('Error fetching admin dashboard:', error);
        throw error;
      }
    },
    {
      enabled: !!auth.accessToken,
      staleTime: 300000,
      ...options
    }
  );
};

// Get admin products
export const useAdminProducts = (options = {}) => {
  const { auth } = useAuth();
  const fetch = useFetch();

  return useQuery(
    ['admin-products'],
    async () => {
      try {
        const result = await fetch(`${baseUrl}admin/products`, auth.accessToken);
        const products = result.data?.data?.products || result.data?.products || result.data || [];
        return { products: Array.isArray(products) ? products : [], ...result.data };
      } catch (error) {
        console.error('Error fetching admin products:', error);
        throw error;
      }
    },
    {
      enabled: !!auth.accessToken,
      staleTime: 300000,
      ...options
    }
  );
};

// Get admin users
export const useAdminUsers = (options = {}) => {
  const { auth } = useAuth();
  const fetch = useFetch();

  return useQuery(
    ['admin-users'],
    async () => {
      try {
        console.log('Fetching users from:', `${baseUrl}/admin/users`);
        console.log('Auth token:', auth.accessToken ? 'Present' : 'Missing');
        const result = await fetch(`${baseUrl}admin/customers`, auth.accessToken);
        console.log('Users API result:', result);
        const users = result.data?.data?.users || result.data?.users || result.data || [];
        return { users: Array.isArray(users) ? users : [], ...result.data };
      } catch (error) {
        console.error('Error fetching admin users:', error);
        throw error;
      }
    },
    {
      enabled: !!auth.accessToken,
      staleTime: 300000,
      ...options
    }
  );
};

// Approve product function
export const useApproveProduct = () => {
  const { auth } = useAuth();
  const post = usePost();

  return {
    mutate: async (productId) => {
      try {
        const result = await post(`${baseUrl}admin/products/${productId}/approve`, {}, auth.accessToken, 'PUT');
        return result;
      } catch (error) {
        throw error;
      }
    }
  };
};

// Reject product function
export const useRejectProduct = () => {
  const { auth } = useAuth();
  const post = usePost();

  return {
    mutate: async (productId) => {
      try {
        const result = await post(`${baseUrl}admin/products/${productId}/reject`, {}, auth.accessToken, 'PUT');
        return result;
      } catch (error) {
        throw error;
      }
    }
  };
};

// Create product function
export const useCreateProduct = () => {
  const { auth } = useAuth();
  const post = usePost();

  return {
    mutate: async (productData) => {
      try {
        const result = await post(`${baseUrl}products`, productData, auth.accessToken, 'POST');
        return result;
      } catch (error) {
        throw error;
      }
    }
  };
};