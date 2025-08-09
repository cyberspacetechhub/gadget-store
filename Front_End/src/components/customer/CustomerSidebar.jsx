import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  ShoppingBagIcon, 
  HeartIcon, 
  UserIcon,
  CogIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import useAuth from '../../hooks/useAuth';

const CustomerSidebar = ({ isOpen, closeSidebar }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const isDashboardContext = location.pathname.startsWith('/dashboard');
  
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { 
      name: 'Orders', 
      href: isDashboardContext ? '/dashboard/orders' : '/orders', 
      icon: ShoppingBagIcon 
    },
    { name: 'Wishlist', href: isDashboardContext ? '/dashboard/wishlist' : '/wishlist', icon: HeartIcon },
    { name: 'Profile', href: isDashboardContext ? '/dashboard/profile' : '/profile', icon: UserIcon },
    { name: 'Settings', href: isDashboardContext ? '/dashboard/settings' : '/settings', icon: CogIcon },
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" 
          onClick={closeSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <nav className="h-full p-4 space-y-2 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href || 
            (item.name === 'Orders' && location.pathname.startsWith('/dashboard/orders')) ||
            (item.name === 'Profile' && location.pathname.startsWith('/dashboard/profile')) ||
            (item.name === 'Settings' && location.pathname.startsWith('/dashboard/settings')) ||
            (item.name === 'Wishlist' && location.pathname.startsWith('/dashboard/wishlist'));
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
        
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 space-x-3 text-gray-600 transition-colors rounded-lg hover:bg-gray-50 hover:text-gray-900"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </nav>
    </div>
    </>
  );
};

export default CustomerSidebar;