import { useQuery, useMutation, useQueryClient } from 'react-query';
import useAuth from './useAuth';
import useFetch from './useFetch';
import usePost from './usePost';

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3600/api/';

export const useCart = () => {
  const { auth } = useAuth();
  const fetch = useFetch();
  const post = usePost();
  const queryClient = useQueryClient();

  // Get guest cart from localStorage
  

  // Get cart
  const { data, isLoading, error } = useQuery(
    ['cart'],
    async () => {
      const token = auth?.accessToken || localStorage.getItem('accessToken');
      if (!token) {
        return { items: [] };
      }
      const result = await fetch(`${baseUrl}cart`, token);
      return result.data?.data || result.data || { items: [] };
    },
    {
      enabled: !!(auth?.accessToken || localStorage.getItem('accessToken')),
      staleTime: 0,
      cacheTime: 0
    }
  );

  // Add to cart
  const addToCart = useMutation(
    async ({ productId, quantity = 1 }) => {
      const token = auth?.accessToken || localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Please login to add items to cart');
      }
      console.log('Adding to cart:', { productId, quantity, token: !!token });
      const result = await post(`${baseUrl}cart/add`, { productId, quantity }, token);
      console.log('Add to cart result:', result);
      return result;
    },
    {
      onSuccess: (data) => {
        console.log('Cart add success:', data);
        queryClient.invalidateQueries(['cart']);
      },
      onError: (error) => {
        console.error('Cart add error:', error);
      }
    }
  );

  // Update quantity
  const updateQuantity = useMutation(
    async ({ productId, quantity }) => {
      return await post(`${baseUrl}cart/update`, { productId, quantity }, auth.accessToken, 'PUT');
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['cart']);
      }
    }
  );

  // Remove from cart
  const removeFromCart = useMutation(
    async (productId) => {
      return await post(`${baseUrl}cart/remove/${productId}`, {}, auth.accessToken, 'DELETE');
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['cart']);
      }
    }
  );

  // Clear cart
  const clearCart = useMutation(
    async () => {
      return await post(`${baseUrl}cart/clear`, {}, auth.accessToken, 'DELETE');
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['cart']);
      }
    }
  );

  return {
    data,
    isLoading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart
  };
};