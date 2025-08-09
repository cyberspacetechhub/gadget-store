import { useQuery, useMutation, useQueryClient } from 'react-query';
import useAuth from './useAuth';
import useFetch from './useFetch';
import usePost from './usePost';
import usePut from './usePut';
import useDelete from './useDelete';

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3600/api/';

export const useUser = (userId) => {
  const { auth } = useAuth();
  const fetch = useFetch();

  return useQuery(
    ['user', userId],
    async () => {
      const result = await fetch(`${baseUrl}admin/users/${userId}`, auth.accessToken);
      return result;
    },
    {
      enabled: !!userId && !!auth.accessToken,
    }
  );
};

export const useUpdateUser = () => {
  const { auth } = useAuth();
  const put = usePut();
  const queryClient = useQueryClient();

  return useMutation(
    async ({ userId, userData }) => {
      return await put(`${baseUrl}admin/users/${userId}`, userData, auth.accessToken);
    },
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(['user', variables.userId]);
        queryClient.invalidateQueries(['admin-users']);
      },
    }
  );
};

export const useDeleteUser = () => {
  const { auth } = useAuth();
  const deleteRequest = useDelete();
  const queryClient = useQueryClient();

  return useMutation(
    async (userId) => {
      return await deleteRequest(`${baseUrl}admin/users/${userId}`, auth.accessToken);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['admin-users']);
      },
    }
  );
};

export const useToggleUserStatus = () => {
  const { auth } = useAuth();
  const put = usePut();
  const queryClient = useQueryClient();

  return useMutation(
    async ({ userId, isActive }) => {
      return await put(`${baseUrl}admin/users/${userId}/status`, { isActive }, auth.accessToken);
    },
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(['user', variables.userId]);
        queryClient.invalidateQueries(['admin-users']);
      },
    }
  );
};