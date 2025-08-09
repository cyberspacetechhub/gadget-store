import { createContext, useContext, useReducer, useEffect } from 'react';
import { cartAPI } from '../services/api';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';

const CartContext = createContext();

const initialState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
  isLoading: false,
  error: null,
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'CART_LOADING':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'CART_SUCCESS':
      return {
        ...state,
        items: action.payload.items || [],
        totalItems: action.payload.totalItems || 0,
        totalAmount: action.payload.totalAmount || 0,
        isLoading: false,
        error: null,
      };
    case 'CART_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'CLEAR_CART':
      return {
        ...initialState,
      };
    case 'UPDATE_ITEM_QUANTITY':
      const updatedItems = state.items.map(item =>
        item.product._id === action.payload.productId
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      const newTotalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const newTotalAmount = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      return {
        ...state,
        items: updatedItems,
        totalItems: newTotalItems,
        totalAmount: newTotalAmount,
      };
    case 'REMOVE_ITEM':
      const filteredItems = state.items.filter(item => item.product._id !== action.payload);
      const filteredTotalItems = filteredItems.reduce((sum, item) => sum + item.quantity, 0);
      const filteredTotalAmount = filteredItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      return {
        ...state,
        items: filteredItems,
        totalItems: filteredTotalItems,
        totalAmount: filteredTotalAmount,
      };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { auth } = useAuth();
  const isAuthenticated = !!auth?.accessToken;
  const user = auth?.user;

  // Fetch cart when user is authenticated and is a customer
  useEffect(() => {
    if (isAuthenticated && user && user.roles === 'Customer') {
      fetchCart();
    } else {
      dispatch({ type: 'CLEAR_CART' });
    }
  }, [isAuthenticated, user]);

  const fetchCart = async () => {
    try {
      dispatch({ type: 'CART_LOADING' });
      const response = await cartAPI.getCart();
      dispatch({ type: 'CART_SUCCESS', payload: response.data });
    } catch (error) {
      dispatch({ type: 'CART_ERROR', payload: error.response?.data?.message || 'Failed to fetch cart' });
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return { success: false };
    }

    try {
      dispatch({ type: 'CART_LOADING' });
      const response = await cartAPI.addToCart({ productId, quantity });
      dispatch({ type: 'CART_SUCCESS', payload: response.data });
      toast.success('Item added to cart');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add item to cart';
      dispatch({ type: 'CART_ERROR', payload: message });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const updateCartItem = async (productId, quantity) => {
    if (!isAuthenticated) {
      toast.error('Please login to update cart');
      return { success: false };
    }

    try {
      // Optimistic update
      dispatch({ type: 'UPDATE_ITEM_QUANTITY', payload: { productId, quantity } });
      
      const response = await cartAPI.updateCartItem({ productId, quantity });
      dispatch({ type: 'CART_SUCCESS', payload: response.data });
      return { success: true };
    } catch (error) {
      // Revert optimistic update by fetching fresh data
      fetchCart();
      const message = error.response?.data?.message || 'Failed to update cart item';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const removeFromCart = async (productId) => {
    if (!isAuthenticated) {
      toast.error('Please login to remove items from cart');
      return { success: false };
    }

    try {
      // Optimistic update
      dispatch({ type: 'REMOVE_ITEM', payload: productId });
      
      const response = await cartAPI.removeFromCart(productId);
      dispatch({ type: 'CART_SUCCESS', payload: response.data });
      toast.success('Item removed from cart');
      return { success: true };
    } catch (error) {
      // Revert optimistic update by fetching fresh data
      fetchCart();
      const message = error.response?.data?.message || 'Failed to remove item from cart';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) {
      return { success: false };
    }

    try {
      await cartAPI.clearCart();
      dispatch({ type: 'CLEAR_CART' });
      toast.success('Cart cleared');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to clear cart';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const getCartSummary = async () => {
    if (!isAuthenticated) {
      return { totalItems: 0, totalAmount: 0, itemCount: 0 };
    }

    try {
      const response = await cartAPI.getCartSummary();
      return response.data;
    } catch (error) {
      console.error('Failed to get cart summary:', error);
      return { totalItems: 0, totalAmount: 0, itemCount: 0 };
    }
  };

  const syncCartPrices = async () => {
    if (!isAuthenticated) {
      return { success: false };
    }

    try {
      const response = await cartAPI.syncCartPrices();
      dispatch({ type: 'CART_SUCCESS', payload: response.data });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to sync cart prices';
      return { success: false, error: message };
    }
  };

  const value = {
    ...state,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    fetchCart,
    getCartSummary,
    syncCartPrices,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};