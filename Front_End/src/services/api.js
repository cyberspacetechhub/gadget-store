import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance for regular API calls
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3600/api/',
  withCredentials: false,
  timeout: 10000,
});

// Create separate axios instance for auth routes that need cookies
const authApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3600/api/',
  withCredentials: true,
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3600/api'}/auth/refresh`, {
          withCredentials: true,
        });
        
        const { accessToken } = response.data.data;
        localStorage.setItem('accessToken', accessToken);
        
        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear storage and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('auth');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API - uses authApi with credentials for cookie handling
export const authAPI = {
  login: (credentials) => authApi.post('/auth/login', credentials),
  register: (userData) => authApi.post('/auth/register', userData),
  logout: () => authApi.post('/auth/logout'),
  refresh: () => authApi.get('/auth/refresh'),
  forgotPassword: (data) => authApi.post('/auth/forgot-password', data),
  resetPassword: (data) => authApi.post('/auth/reset-password', data),
  verifyEmail: (token) => authApi.get(`/auth/verify-email/${token}`),
  updateProfile: (data) => api.put('/profile', data),
};

// Products API
export const productsAPI = {
  getProducts: (params) => api.get('/products', { params }),
  getProduct: (id) => api.get(`/products/${id}`),
  getFeaturedProducts: (params) => api.get('/products/featured', { params }),
  searchProducts: (params) => api.get('/products/search', { params }),
  getComparisonData: (ids) => api.get('/products/compare', { params: { ids } }),
  getProductsByCategory: (categoryId, params) => api.get(`/products/category/${categoryId}`, { params }),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
};

// Categories API
export const categoriesAPI = {
  getCategories: (params) => api.get('/categories', { params }),
  getCategory: (id) => api.get(`/categories/${id}`),
  createCategory: (data) => api.post('/categories', data),
  updateCategory: (id, data) => api.put(`/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/categories/${id}`),
};

// Cart API
export const cartAPI = {
  getCart: () => api.get('/cart'),
  getCartSummary: () => api.get('/cart/summary'),
  addToCart: (data) => api.post('/cart/add', data),
  updateCartItem: (data) => api.put('/cart/update', data),
  removeFromCart: (productId) => api.delete(`/cart/remove/${productId}`),
  clearCart: () => api.delete('/cart/clear'),
  syncCartPrices: () => api.post('/cart/sync-prices'),
};

// Wishlist API
export const wishlistAPI = {
  getWishlist: () => api.get('/wishlist'),
  addToWishlist: (productId) => api.post('/wishlist/add', { productId }),
  removeFromWishlist: (productId) => api.delete(`/wishlist/remove/${productId}`),
  clearWishlist: () => api.delete('/wishlist/clear'),
};

// Orders API
export const ordersAPI = {
  getOrders: (params) => api.get('/orders', { params }),
  getOrder: (id) => api.get(`/orders/${id}`),
  createOrder: (data) => api.post('/orders', data),
  updateOrderStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  cancelOrder: (id) => api.put(`/orders/${id}/cancel`),
  trackOrder: (orderNumber) => api.get(`/orders/track/${orderNumber}`),
};

// Reviews API
export const reviewsAPI = {
  getProductReviews: (productId, params) => api.get(`/reviews/product/${productId}`, { params }),
  getUserReviews: (params) => api.get('/reviews/user', { params }),
  createReview: (data) => api.post('/reviews', data),
  updateReview: (id, data) => api.put(`/reviews/${id}`, data),
  deleteReview: (id) => api.delete(`/reviews/${id}`),
  voteReview: (id, vote) => api.post(`/reviews/${id}/vote`, { vote }),
};

// Payments API
export const paymentsAPI = {
  initializePayment: (data) => api.post('/payments/initialize', data),
  verifyPayment: (reference) => api.get(`/payments/verify/${reference}`),
  getPaymentMethods: () => api.get('/payments/methods'),
  savePaymentMethod: (data) => api.post('/payments/methods', data),
  deletePaymentMethod: (id) => api.delete(`/payments/methods/${id}`),
};

// Addresses API
export const addressesAPI = {
  getAddresses: () => api.get('/addresses'),
  getAddress: (id) => api.get(`/addresses/${id}`),
  createAddress: (data) => api.post('/addresses', data),
  updateAddress: (id, data) => api.put(`/addresses/${id}`, data),
  deleteAddress: (id) => api.delete(`/addresses/${id}`),
  setDefaultAddress: (id) => api.put(`/addresses/${id}/default`),
};

// Admin API
export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUserStatus: (id, status) => api.put(`/admin/users/${id}/status`, { status }),
  getOrders: (params) => api.get('/admin/orders', { params }),
  updateOrderStatus: (id, status) => api.put(`/admin/orders/${id}/status`, { status }),
  getProducts: (params) => api.get('/admin/products', { params }),
  approveProduct: (id) => api.put(`/admin/products/${id}/approve`),
  rejectProduct: (id) => api.put(`/admin/products/${id}/reject`),
  getAnalytics: (params) => api.get('/admin/analytics', { params }),
};

// Vendor API
export const vendorAPI = {
  getDashboardStats: () => api.get('/vendor/dashboard'),
  getProducts: (params) => api.get('/vendor/products', { params }),
  getOrders: (params) => api.get('/vendor/orders', { params }),
  updateOrderStatus: (id, status) => api.put(`/vendor/orders/${id}/status`, { status }),
  getAnalytics: (params) => api.get('/vendor/analytics', { params }),
  updateProfile: (data) => api.put('/vendor/profile', data),
};

// Upload API
export const uploadAPI = {
  uploadImage: (file, folder = 'products') => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);
    
    return api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  uploadMultipleImages: (files, folder = 'products') => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });
    formData.append('folder', folder);
    
    return api.post('/upload/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default api;