import { useQuery, useMutation, useQueryClient } from 'react-query';
import useAuth from './useAuth';
import useFetch from './useFetch';

// Get customer orders
export const useCustomerOrders = (params = {}) => {
  const { auth } = useAuth();
  const fetch = useFetch();

  return useQuery(
    ['customer-orders', params],
    async () => {
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 10,
        ...(params.search && { search: params.search }),
        ...(params.status && { status: params.status })
      });
      
      return await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3600/api/'}orders/my-orders?${queryParams}`,
        auth.accessToken
      );
    },
    { 
      enabled: !!auth.accessToken,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};

// Get single order
export const useOrder = (orderId) => {
  const { auth } = useAuth();
  const fetch = useFetch();

  return useQuery(
    ['order', orderId],
    async () => {
      return await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3600/api/'}orders/${orderId}`,
        auth.accessToken
      );
    },
    { 
      enabled: !!orderId && !!auth.accessToken,
      staleTime: 5 * 60 * 1000,
    }
  );
};

// Get admin orders
export const useAdminOrders = (params = {}) => {
  const { auth } = useAuth();
  const fetch = useFetch();

  return useQuery(
    ['admin-orders', params],
    async () => {
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 10,
        ...(params.search && { search: params.search }),
        ...(params.status && { status: params.status })
      });
      
      return await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3600/api/'}orders?${queryParams}`,
        auth.accessToken
      );
    },
    { 
      enabled: !!auth.accessToken,
      staleTime: 2 * 60 * 1000, // 2 minutes for admin data
    }
  );
};

// Update order status (admin only)
export const useUpdateOrderStatus = () => {
  const { auth } = useAuth();
  const queryClient = useQueryClient();

  return useMutation(
    async ({ orderId, status, notes }) => {
      const response = await window.fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3600/api/'}orders/${orderId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth.accessToken}`
          },
          body: JSON.stringify({ status, notes })
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update order status');
      }

      return response.json();
    },
    {
      onSuccess: () => {
        // Invalidate and refetch admin orders
        queryClient.invalidateQueries(['admin-orders']);
        queryClient.invalidateQueries(['order']);
      }
    }
  );
};

// Cancel order (customer)
export const useCancelOrder = () => {
  const { auth } = useAuth();
  const queryClient = useQueryClient();

  return useMutation(
    async (orderId) => {
      const response = await window.fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3600/api/'}orders/${orderId}/cancel`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${auth.accessToken}`
          }
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to cancel order');
      }

      return response.json();
    },
    {
      onSuccess: () => {
        // Invalidate and refetch customer orders
        queryClient.invalidateQueries(['customer-orders']);
        queryClient.invalidateQueries(['order']);
      }
    }
  );
};

// Delete order (admin only)
export const useDeleteOrder = () => {
  const { auth } = useAuth();
  const queryClient = useQueryClient();

  return useMutation(
    async (orderId) => {
      const response = await window.fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3600/api/'}orders/${orderId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${auth.accessToken}`
          }
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete order');
      }

      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['admin-orders']);
        queryClient.invalidateQueries(['order']);
      }
    }
  );
};

// Bulk delete orders (admin only)
export const useBulkDeleteOrders = () => {
  const { auth } = useAuth();
  const queryClient = useQueryClient();

  return useMutation(
    async (orderIds) => {
      const response = await window.fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3600/api/'}orders/bulk`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth.accessToken}`
          },
          body: JSON.stringify({ orderIds })
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete orders');
      }

      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['admin-orders']);
      }
    }
  );
};

// Create order
export const useCreateOrder = () => {
  const { auth } = useAuth();
  const queryClient = useQueryClient();

  return useMutation(
    async (orderData) => {
      const response = await window.fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3600/api/'}orders`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth.accessToken}`
          },
          body: JSON.stringify(orderData)
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create order');
      }

      return response.json();
    },
    {
      onSuccess: () => {
        // Invalidate and refetch customer orders and cart
        queryClient.invalidateQueries(['customer-orders']);
        queryClient.invalidateQueries(['cart']);
      }
    }
  );
};

// Backward compatibility
export const useOrders = () => {
  const customerOrders = useCustomerOrders();
  const createOrder = useCreateOrder();
  
  return {
    ...customerOrders,
    createOrder
  };
};