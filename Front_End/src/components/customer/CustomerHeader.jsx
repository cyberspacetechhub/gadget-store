import { Link } from 'react-router-dom';
import { BellIcon, UserIcon } from '@heroicons/react/24/outline';
import useAuth from '../../hooks/useAuth';

const CustomerHeader = () => {
  const { auth } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
            <p className="text-gray-600">Welcome back, {auth.user?.firstName || auth.user?.username}</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <BellIcon className="w-6 h-6" />
            </button>
            
            <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium">
              Back to Store
            </Link>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-gray-900 font-medium">
                {auth.user?.firstName || auth.user?.username}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default CustomerHeader;