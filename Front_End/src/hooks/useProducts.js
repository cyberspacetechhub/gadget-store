import { useQuery } from 'react-query';
import useAuth from './useAuth';
import useFetch from './useFetch';

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3600/api/';

// Get products with filters
export const useProducts = (options = {}) => {
  const { auth } = useAuth();
  const fetch = useFetch();

  const {
    enabled = true,
    staleTime = 300000, // 5 minutes
    ...queryOptions
  } = options;

  return useQuery(
    ['products'],
    async () => {
      try {
        const result = await fetch(`${baseUrl}products`);
        console.log('API Response:', result);
        const products = result.data?.data || [];
        return { products: Array.isArray(products) ? products : [], meta: result.data?.meta };
      } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
    },
    {
      // enabled: enabled && !!auth.accessToken,
      staleTime,
      ...queryOptions
    }
  );
};

// Get single product
export const useProduct = (id, options = {}) => {
  const { auth } = useAuth();
  const fetch = useFetch();

  return useQuery(
    ['product', id],
    async () => {
      try {
        const result = await fetch(`${baseUrl}products/${id}`);
        return result.data?.data || result.data || {};
      } catch (error) {
        console.error('Error fetching product:', error);
        throw error;
      }
    },
    {
      enabled: !!id,
      staleTime: 300000,
      ...options
    }
  );
};

// Get featured products
export const useFeaturedProducts = (options = {}) => {
  const { auth } = useAuth();
  const fetch = useFetch();

  return useQuery(
    ['featured-products'],
    async () => {
      try {
        const result = await fetch(`${baseUrl}products/featured`, auth.accessToken);
        const products = result.data?.data || [];
        return { products: Array.isArray(products) ? products : [] };
      } catch (error) {
        console.error('Error fetching featured products:', error);
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