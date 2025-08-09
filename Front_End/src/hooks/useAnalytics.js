import { useQuery } from 'react-query';
import useAuth from './useAuth';
import useFetch from './useFetch';

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3600/api';

export const useAnalytics = (timeRange = '30d') => {
  const { auth } = useAuth();
  const fetch = useFetch();

  return useQuery(
    ['analytics', timeRange],
    async () => {
      const result = await fetch(`${baseUrl}admin/analytics?timeRange=${timeRange}`, auth.accessToken);
      return result;
    },
    {
      enabled: !!auth.accessToken,
    }
  );
};