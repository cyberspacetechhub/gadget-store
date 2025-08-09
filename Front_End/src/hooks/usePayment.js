import { useMutation } from 'react-query';
import useAuth from './useAuth';
import usePost from './usePost';

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3600/api';

export const useInitializePayment = () => {
  const { auth } = useAuth();
  const post = usePost();

  return useMutation(
    async (paymentData) => {
      return await post(`${baseUrl}/payments/initialize`, paymentData, auth.accessToken);
    }
  );
};

export const useVerifyPayment = () => {
  const { auth } = useAuth();
  const post = usePost();

  return useMutation(
    async (reference) => {
      return await post(`${baseUrl}/payments/verify`, { reference }, auth.accessToken);
    }
  );
};

export const useConfirmCOD = () => {
  const { auth } = useAuth();
  const post = usePost();

  return useMutation(
    async (orderId) => {
      return await post(`${baseUrl}/payments/confirm-cod`, { orderId }, auth.accessToken);
    }
  );
};