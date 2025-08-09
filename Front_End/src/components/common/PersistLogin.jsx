import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import useRefreshToken from '../../hooks/useRefreshToken';
import LoadingSpinner from './LoadingSpinner';

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth, persist, isLoading: authLoading } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        if (!auth?.accessToken && persist) {
          await refresh();
        }
      } catch (err) {
        console.error('Token refresh failed:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (!authLoading) {
      if (auth?.accessToken || !persist) {
        setIsLoading(false);
      } else {
        verifyRefreshToken();
      }
    }

    return () => {
      isMounted = false;
    };
  }, [auth?.accessToken, persist, refresh, authLoading]);

  if (authLoading || (persist && isLoading)) {
    return (
      <div className="flex items-center justify-center p-20">
        <LoadingSpinner />
      </div>
    );
  }

  return <Outlet />;
};

export default PersistLogin;