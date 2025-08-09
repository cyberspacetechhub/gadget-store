import { createContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [persist, setPersist] = useState(localStorage.getItem('persist') === 'true');
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedAuth = localStorage.getItem('auth');
        const accessToken = localStorage.getItem('accessToken');
        
        if (storedAuth && accessToken) {
          const parsedAuth = JSON.parse(storedAuth);
          setAuth({ ...parsedAuth, accessToken });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        localStorage.removeItem('auth');
        localStorage.removeItem('accessToken');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Update localStorage when auth changes
  useEffect(() => {
    if (auth?.user && auth?.accessToken) {
      localStorage.setItem('auth', JSON.stringify({ user: auth.user }));
      localStorage.setItem('accessToken', auth.accessToken);
    } else if (!isLoading) {
      localStorage.removeItem('auth');
      localStorage.removeItem('accessToken');
    }
  }, [auth, isLoading]);

  const logout = useCallback(() => {
    setAuth({});
    localStorage.removeItem('auth');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('persist');
  }, []);

  const updateAuth = useCallback((newAuth) => {
    setAuth(newAuth);
  }, []);

  return (
    <AuthContext.Provider value={{ 
      auth, 
      setAuth: updateAuth, 
      persist, 
      setPersist, 
      logout, 
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;