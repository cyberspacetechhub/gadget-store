import useAuth from './useAuth';
import { authAPI } from '../services/api';

const useRefreshToken = () => {
  const { auth, setAuth } = useAuth();

  const refresh = async () => {
    try {
      const response = await authAPI.refresh();
      const responseData = response.data?.data || response.data;
      
      setAuth(responseData);
      return responseData.accessToken;
    } catch (error) {
      console.error('Refresh token error:', error);
      throw error;
    }
  };

  return refresh;
};

export default useRefreshToken;