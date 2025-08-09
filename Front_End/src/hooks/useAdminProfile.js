import { useQuery, useMutation, useQueryClient } from 'react-query';
import useAuth from './useAuth';
import useFetch from './useFetch';
import usePut from './usePut';

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3600/api';

export const useAdminProfile = () => {
  const { auth } = useAuth();
  const fetch = useFetch();

  return useQuery(
    ['admin-profile'],
    async () => {
      const result = await fetch(`${baseUrl}/admin/profile`, auth.accessToken);
      return result;
    },
    {
      enabled: !!auth.accessToken,
    }
  );
};

export const useUpdateAdminProfile = () => {
  const { auth } = useAuth();
  const put = usePut();
  const queryClient = useQueryClient();

  return useMutation(
    async (profileData) => {
      return await put(`${baseUrl}/admin/profile`, profileData, auth.accessToken);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['admin-profile']);
      },
    }
  );
};

export const useChangePassword = () => {
  const { auth } = useAuth();
  const put = usePut();

  return useMutation(
    async (passwordData) => {
      return await put(`${baseUrl}/admin/change-password`, passwordData, auth.accessToken);
    }
  );
};