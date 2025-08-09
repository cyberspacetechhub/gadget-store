import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from 'react-query';
import {
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  HeartIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';

import useAuth from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { useTheme } from '../../context/ThemeContext';
import SearchModal from '../common/SearchModal';
import useFetch from '../../hooks/useFetch';

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  const navigate = useNavigate();
  const { auth, logout } = useAuth();
  const { data: cart } = useCart();
  const { theme, toggleTheme } = useTheme();
  const user = auth?.user;
  const isAuthenticated = !!auth?.accessToken;
  const totalItems = cart?.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
  
  const userMenuRef = useRef(null);
  const cartRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setIsCartOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const fetch = useFetch();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'All Products', href: '/products' },
    { name: 'Categories', href: '/categories' },
    { name: 'Special Deals', href: '/deals' },
    { name: 'New Arrivals', href: '/new-arrivals' },
    { name: 'Best Sellers', href: '/best-sellers' }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b shadow-lg border-slate-200 dark:bg-gray-900 dark:border-gray-700">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600">
                  <span className="text-sm font-bold text-white">GS</span>
                </div>
                <span className="text-xl font-bold text-slate-900 dark:text-white">
                  GadgetStore
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex flex-wrap items-center space-x-0">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="px-3 py-2 text-sm font-semibold transition-all duration-300 rounded-lg text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 whitespace-nowrap"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Search Bar */}
            <div className="flex-1 hidden max-w-lg mx-4 lg:mx-8 lg:flex">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="w-full py-2 pl-10 pr-4 border rounded-lg border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  onClick={() => setIsSearchOpen(true)}
                  readOnly
                />
                <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Mobile Search */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-gray-600 lg:hidden hover:text-blue-600 dark:text-gray-300"
              >
                <MagnifyingGlassIcon className="w-6 h-6" />
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-300"
              >
                {theme === 'dark' ? (
                  <SunIcon className="w-6 h-6" />
                ) : (
                  <MoonIcon className="w-6 h-6" />
                )}
              </button>

              {/* Wishlist */}
              {isAuthenticated && (
                <Link
                  to="/wishlist"
                  className="p-2 text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-300"
                >
                  <HeartIcon className="w-6 h-6" />
                </Link>
              )}

              {/* Cart */}
              <div className="relative" ref={cartRef}>
                <Link
                  to="/cart"
                  className="relative p-2 text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-300"
                >
                  <ShoppingCartIcon className="w-6 h-6" />
                  {totalItems > 0 && (
                    <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-blue-600 rounded-full top-6 -right-1">
                      {totalItems > 99 ? '99+' : totalItems}
                    </span>
                  )}
                </Link>
              </div>

              {/* User Menu - Desktop only */}
              {isAuthenticated ? (
                <div className="relative hidden sm:block" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center p-2 space-x-2 text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-300"
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full">
                      <span className="text-sm font-medium text-white">
                        {user?.firstName?.charAt(0) || user?.username?.charAt(0)}
                      </span>
                    </div>
                    <ChevronDownIcon className="w-4 h-4" />
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 w-48 py-1 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700"
                      >
                        <button
                          onClick={() => {
                            const role = user?.roles;
                            if (role === "Admin") {
                              navigate('/admin/dashboard');
                            } else if (role === "Vendor") {
                              navigate('/vendor/dashboard');
                            } else {
                              navigate('/dashboard');
                            }
                            setIsUserMenuOpen(false);
                          }}
                          className="block w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Dashboard
                        </button>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Profile
                        </Link>
                        <Link
                          to="/orders"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Orders
                        </Link>
                        <hr className="my-1 border-gray-200 dark:border-gray-700" />
                        <button
                          onClick={handleLogout}
                          className="block w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden sm:flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-600 md:hidden hover:text-blue-600 dark:text-gray-300"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="w-6 h-6" />
                ) : (
                  <Bars3Icon className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="py-4 border-t border-gray-200 md:hidden dark:border-gray-700"
              >
                <nav className="flex flex-col space-y-2">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="px-4 py-2 font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-3 py-2">
                          <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full">
                            <span className="text-sm font-medium text-white">
                              {user?.firstName?.charAt(0) || user?.username?.charAt(0)}
                            </span>
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {user?.firstName || user?.username}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const role = user?.roles;
                          if (role === "Admin") {
                            navigate('/admin/dashboard');
                          } else if (role === "Vendor") {
                            navigate('/vendor/dashboard');
                          } else {
                            navigate('/dashboard');
                          }
                          setIsMobileMenuOpen(false);
                        }}
                        className="block w-full px-4 py-2 text-left font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300"
                      >
                        Dashboard
                      </button>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-4 py-2 font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full px-4 py-2 text-left font-medium text-red-600 hover:text-red-700"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="px-4 py-2 font-medium text-gray-600 hover:text-blue-600"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        className="px-4 py-2 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 mx-4"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
};

export default Header;