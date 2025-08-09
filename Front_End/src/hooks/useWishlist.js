import { useQuery, useMutation, useQueryClient } from 'react-query';
import useAuth from './useAuth';
import useFetch from './useFetch';
import usePost from './usePost';

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3600/api';

export const useWishlist = () => {
  const { auth } = useAuth();
  const fetch = useFetch();
  const post = usePost();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery(
    ['wishlist'],
    async () => {
      const token = auth?.accessToken || localStorage.getItem('accessToken');
      if (!token) return { items: [] };
      const result = await fetch(`${baseUrl}wishlist`, token);
      return result.data || { items: [] };
    },
    {
      enabled: !!(auth?.accessToken || localStorage.getItem('accessToken')),
    }
  );

  const addToWishlist = useMutation(
    async (productId) => {
      const token = auth?.accessToken || localStorage.getItem('accessToken');
      if (!token) throw new Error('Authentication required');
      return await post(`${baseUrl}wishlist/add`, { productId }, token);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['wishlist']);
      }
    }
  );

  const removeFromWishlist = useMutation(
    async (productId) => {
      const token = auth?.accessToken || localStorage.getItem('accessToken');
      return await post(`${baseUrl}wishlist/remove/${productId}`, {}, token, 'DELETE');
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['wishlist']);
      }
    }
  );

  return {
    data,
    isLoading,
    error,
    addToWishlist,
    removeFromWishlist
  };
};

export const useAddToWishlist = () => {
  const { addToWishlist } = useWishlist();
  return addToWishlist;
};