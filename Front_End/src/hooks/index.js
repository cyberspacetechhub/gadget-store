// Export all custom hooks for easier imports
export { useProducts, useProduct, useFeaturedProducts } from './useProducts';
export { useCart, useAddToCart, useUpdateCartItem, useRemoveFromCart, useClearCart } from './useCart';
export { useAdminDashboard, useAdminProducts, useAdminUsers, useApproveProduct, useRejectProduct, useCreateProduct } from './useAdmin';
export { useWishlist, useAddToWishlist, useRemoveFromWishlist } from './useWishlist';

// Re-export existing hooks
export { default as useAuth } from './useAuth';
export { default as useRefreshToken } from './useRefreshToken';
export { default as useAxiosPrivate } from './useAxiosPrivate';
export { default as useFetch } from './useFetch';
export { default as usePost } from './usePost';
export { default as usePatch } from './usePatch';