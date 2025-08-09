import { useMutation, useQueryClient } from 'react-query';
import usePost from './usePost';
import useAuth from './useAuth';

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3600/api/';

export const useCartMigration = () => {
  const post = usePost();
  const queryClient = useQueryClient();

  const migrateGuestCart = useMutation(
    async (accessToken) => {
      const guestCartData = localStorage.getItem('guestCart');
      if (!guestCartData) return null;

      const guestCart = JSON.parse(guestCartData);
      if (!guestCart.items || guestCart.items.length === 0) return null;

      const result = await post(
        `${baseUrl}cart/migrate`,
        { guestCartItems: guestCart.items },
        accessToken
      );

      localStorage.removeItem('guestCart');
      return result;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['cart']);
      }
    }
  );

  return { migrateGuestCart };
};