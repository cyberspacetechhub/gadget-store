import { Link } from 'react-router-dom';
import { 
  ShoppingBagIcon, 
  HeartIcon, 
  TruckIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline';
import { useCustomerOrders } from '../../hooks/useOrders';
import { useWishlist } from '../../hooks/useWishlist';
import useAuth from '../../hooks/useAuth';
import LoadingSpinner from '../common/LoadingSpinner';

const Dashboard = () => {
  const { auth } = useAuth();
  const { data: ordersData, isLoading: ordersLoading, error: ordersError } = useCustomerOrders();
  const { data: wishlistData } = useWishlist();

  // Handle different data structures from API
  const ordersArray = ordersData?.data?.data?.orders || ordersData?.orders || [];
  const recentOrders = ordersArray.slice(0, 3);
  const wishlistCount = wishlistData?.data?.items?.length || wishlistData?.items?.length || 0;
  const totalOrders = ordersArray.length;
  
  // Calculate order statuses properly
  const completedOrders = ordersArray.filter(order => 
    order.status?.toLowerCase() === 'delivered'
  ).length;
  
  const pendingOrders = ordersArray.filter(order => {
    const status = order.status?.toLowerCase();
    return status === 'pending' || status === 'confirmed' || status === 'processing' || status === 'shipped';
  }).length;
  
  const cancelledOrders = ordersArray.filter(order => 
    order.status?.toLowerCase() === 'cancelled'
  ).length;

  const stats = [
    { name: 'Total Orders', value: totalOrders, icon: ShoppingBagIcon, color: 'blue' },
    { name: 'Completed Orders', value: completedOrders, icon: CheckCircleIcon, color: 'green' },
    { name: 'Pending Orders', value: pendingOrders, icon: TruckIcon, color: 'yellow' },
    { name: 'Wishlist Items', value: wishlistCount, icon: HeartIcon, color: 'red' },
  ];

  const getStatusColor = (status) => {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (ordersLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {auth.user?.name || auth.user?.firstName || auth.user?.username}!</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <Link to="/dashboard/orders" className="font-medium text-blue-600 hover:text-blue-700">
              View All
            </Link>
          </div>
        </div>
        
        <div className="p-6">
          {recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        Order #{order.orderNumber || order._id?.slice(-8)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {order.items?.length || 0} items
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.orderStatus?.charAt(0).toUpperCase() + order.orderStatus?.slice(1) || 'Unknown'}
                    </span>
                    <p className="font-semibold text-gray-900">
                      ₦{order.totalAmount?.toLocaleString() || '0'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <ShoppingBagIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">No orders yet</p>
              <Link to="/" className="font-medium text-blue-600 hover:text-blue-700">
                Start Shopping
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;