import { useQuery, useMutation, useQueryClient } from 'react-query';
import { reviewsAPI } from '../services/api';
import toast from 'react-hot-toast';

// Query keys
export const REVIEWS_QUERY_KEYS = {
  all: ['reviews'],
  product: (productId, params) => [...REVIEWS_QUERY_KEYS.all, 'product', productId, { params }],
  user: (params) => [...REVIEWS_QUERY_KEYS.all, 'user', { params }],
};

// Get product reviews
export const useProductReviews = (productId, params = {}) => {
  return useQuery({
    queryKey: REVIEWS_QUERY_KEYS.product(productId, params),
    queryFn: () => reviewsAPI.getProductReviews(productId, params),
    select: (data) => data.data,
    enabled: !!productId,
  });
};

// Get user reviews
export const useUserReviews = (params = {}) => {
  return useQuery({
    queryKey: REVIEWS_QUERY_KEYS.user(params),
    queryFn: () => reviewsAPI.getUserReviews(params),
    select: (data) => data.data,
  });
};

// Create review mutation
export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reviewsAPI.createReview,
    onSuccess: (data) => {
      queryClient.invalidateQueries(REVIEWS_QUERY_KEYS.all);
      toast.success('Review submitted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    },
  });
};

// Update review mutation
export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => reviewsAPI.updateReview(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(REVIEWS_QUERY_KEYS.all);
      toast.success('Review updated successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update review');
    },
  });
};

// Delete review mutation
export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reviewsAPI.deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries(REVIEWS_QUERY_KEYS.all);
      toast.success('Review deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete review');
    },
  });
};

// Vote review mutation
export const useVoteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, vote }) => reviewsAPI.voteReview(id, vote),
    onSuccess: () => {
      queryClient.invalidateQueries(REVIEWS_QUERY_KEYS.all);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to vote on review');
    },
  });
};