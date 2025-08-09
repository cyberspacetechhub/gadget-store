import { useState } from 'react';
import axios from 'axios';
import useAuth from './useAuth';

const usePatch = () => {
  const { auth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const patchData = async (url, data = {}, options = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.accessToken}`,
          ...options.headers
        },
        ...options
      };

      const response = await axios.patch(url, data, config);
      
      setIsLoading(false);
      
      return {
        success: true,
        data: response.data,
        status: response.status,
        statusText: response.statusText
      };
    } catch (err) {
      setIsLoading(false);
      
      const errorResponse = {
        success: false,
        error: err.response?.data?.message || err.message || 'An error occurred',
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data
      };
      
      setError(errorResponse);
      throw errorResponse;
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    patchData,
    isLoading,
    error,
    clearError
  };
};

export default usePatch;