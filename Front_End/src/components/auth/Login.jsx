import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useContext } from 'react';
import { authAPI } from '../../services/api';
import AuthContext from '../../context/AuthContext';
import { EyeIcon, EyeSlashIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

import toast from 'react-hot-toast';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { auth, setAuth, persist, setPersist } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || new URLSearchParams(location.search).get('redirect') || '/';
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ mode: 'all' });

  const login = async (data) => {
    setIsLoading(true);
    
    try {
      // Determine if input is email or username
      const isEmail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(data.emailOrUsername);
      const credentials = {
        password: data.password,
        ...(isEmail ? { email: data.emailOrUsername } : { username: data.emailOrUsername })
      };
      
      const response = await authAPI.login(credentials);
      
      if (response.status === 200) {
        console.log(response)
        const { accessToken, user } = response.data.data;
        
        // Store access token
        localStorage.setItem('accessToken', accessToken);
        
        // Set auth context
        setAuth({ accessToken, user });
        
        toast.success('Logged in Successfully');
        setIsLoading(false);
        
        // Navigate based on redirect or user role
        const userRole = user?.roles;
        
        // Small delay to ensure cart migration completes
        setTimeout(() => {
          if (from && from !== '/' && from !== '/login') {
            navigate(from);
          } else {
            switch(userRole) {
              case 'Customer':
                navigate('/dashboard');
                break;
              case 'Vendor':
                navigate('/vendor/dashboard');
                break;
              case 'Admin':
                navigate('/admin/dashboard');
                break;
              default:
                navigate('/dashboard');
            }
          }
        }, 200);
      }
    } catch (err) {
      setIsLoading(false);
      
      // Handle specific error cases
      switch (err?.response?.status) {
        case 400:
          toast.error('Please check your email and password');
          break;
        case 401:
          toast.error('Invalid credentials. Please try again.');
          break;
        case 403:
          toast.error('Account is not active. Please contact support.');
          break;
        case 404:
          toast.error('User not found. Please check your email.');
          break;
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        default:
          if (err?.code === 'NETWORK_ERROR') {
            toast.error('Network error. Please check your connection.');
          } else {
            toast.error('Login failed. Please try again.');
          }
          break;
      }
      
      console.error('Login error:', err);
    }
  };
  
  const togglePersist = () => { setPersist(prev => !prev) };
  
  useEffect(() => {
    localStorage.setItem('persist', persist);
  }, [persist]);
console.log(auth)
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container px-4 mx-auto max-w-7xl py-14">
        {/* Header Section */}
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-indigo-100 rounded-full dark:bg-indigo-900">
              <ShoppingBagIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-center text-gray-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-center text-gray-600 dark:text-gray-300">
            <span>Don't have an account? </span>
            <Link
              to="/register"
              className="font-medium text-indigo-600 underline transition-colors hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 hover:no-underline"
            >
              Sign up for free
            </Link>
          </p>
        </div>
        
        {/* Form Section */}
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="overflow-hidden bg-white shadow-xl dark:bg-gray-800 dark:border dark:border-gray-700 rounded-2xl">
            <div className="px-8 py-10">
              <form onSubmit={handleSubmit(login)} className="space-y-6">
                <div>
                  <label 
                    htmlFor="emailOrUsername" 
                    className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Email or Username
                  </label>
                  <div className="relative">
                    <input
                      id="emailOrUsername"
                      type="text"
                      autoComplete="username"
                      {...register('emailOrUsername', {
                        required: 'Email or username is required'
                      })}
                      className={`dark:bg-gray-700 dark:border-gray-600 dark:text-white block w-full rounded-lg border py-3 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                        errors.emailOrUsername 
                          ? 'border-red-300 focus:ring-red-500' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="Enter your email or username"
                    />
                  </div>
                  {errors.emailOrUsername && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {errors.emailOrUsername.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <label 
                    htmlFor="password" 
                    className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      {...register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters'
                        }
                      })}
                      className={`dark:bg-gray-700 dark:border-gray-600 dark:text-white block w-full rounded-lg border py-3 px-4 pr-12 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                        errors.password 
                          ? 'border-red-300 focus:ring-red-500' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      onChange={togglePersist}
                      checked={persist}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor="remember-me" className="block ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <Link
                      to="/forgot-password"
                      className="font-medium text-indigo-600 underline transition-colors hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 hover:no-underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                  >
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      {isLoading && (
                        <div className="w-5 h-5 border-b-2 border-white rounded-full animate-spin"></div>
                      )}
                    </span>
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </button>
                </div>
              </form>
              
              {/* Social Login Section */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 text-gray-500 bg-white dark:bg-gray-800 dark:text-gray-400">
                      Or continue with
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mt-6">
                  <button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-500 transition-colors bg-white border border-gray-300 rounded-lg shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <span className="sr-only">Sign in with Google</span>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  </button>
                  
                  <button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-500 transition-colors bg-white border border-gray-300 rounded-lg shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <span className="sr-only">Sign in with GitHub</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;