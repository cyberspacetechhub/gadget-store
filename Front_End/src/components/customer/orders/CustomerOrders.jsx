import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  EyeIcon, 
  MagnifyingGlassIcon,
  ClockIcon,
  CheckCircleIcon,
  TruckIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { useQuery } from 'react-query';
import useFetch from '../../../hooks/useFetch';
import useAuth from '../../../hooks/useAuth';
import LoadingSpinner from '../../common/LoadingSpinner';
import OrderStatusTracker from '../../common/OrderStatusTracker';

const CustomerOrders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const { auth } = useAuth();
  const fetch = useFetch();

  const { data, isLoading } = useQuery(
    ['customer-orders', currentPage, searchTerm, statusFilter],
    async () => {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && { status: statusFilter })
      });
      
      return await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3600/api/'}orders/my-orders?${params}`,
        auth.accessToken
      );
    },
    { enabled: !!auth.accessToken }
  );

  const orders = data?.data?.data?.orders || [];
  const totalPages = data?.data?.data?.totalPages || 1;

  const getStatusIcon = (status) => {
    const icons = {
      'pending': <ClockIcon className="w-5 h-5 text-yellow-500" />,
      'confirmed': <CheckCircleIcon className="w-5 h-5 text-blue-500" />,
      'processing': <ClockIcon className="w-5 h-5 text-purple-500" />,
      'shipped': <TruckIcon className="w-5 h-5 text-indigo-500" />,
      'delivered': <CheckCircleIcon className="w-5 h-5 text-green-500" />,
      'cancelled': <XCircleIcon className="w-5 h-5 text-red-500" />
    };
    return icons[status] || <ClockIcon className="w-5 h-5 text-gray-500" />;
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-50 text-yellow-700 border-yellow-200',
      'confirmed': 'bg-blue-50 text-blue-700 border-blue-200',
      'processing': 'bg-purple-50 text-purple-700 border-purple-200',
      'shipped': 'bg-indigo-50 text-indigo-700 border-indigo-200',
      'delivered': 'bg-green-50 text-green-700 border-green-200',
      'cancelled': 'bg-red-50 text-red-700 border-red-200'
    };
    return colors[status] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container px-4 mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 lg:text-5xl dark:text-white">
            My Orders
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-400">
            Track your orders and view purchase history
          </p>
        </div>

        {/* Filters */}
        <div className="p-6 mb-8 bg-white shadow-xl dark:bg-gray-800 rounded-2xl">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-3 pl-10 pr-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Orders</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center">
            <div className="flex items-center justify-center w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900">
              <TruckIcon className="w-16 h-16 text-blue-500" />
            </div>
            <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">No orders found</h3>
            <p className="mb-8 text-gray-600 dark:text-gray-400">
              {searchTerm || statusFilter ? 'Try adjusting your search criteria' : 'You haven\'t placed any orders yet'}
            </p>
            <Link
              to="/products"
              className="inline-flex items-center px-8 py-4 font-bold text-white transition-all duration-300 transform rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="overflow-hidden transition-shadow duration-300 bg-white shadow-xl dark:bg-gray-800 rounded-2xl hover:shadow-2xl">
                <div className="p-6">
                  {/* Order Header */}
                  <div className="flex flex-col mb-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                        Order #{order.orderNumber}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="flex items-center mt-4 space-x-4 sm:mt-0">
                      <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.orderStatus)}
                        <span className="ml-2 capitalize">{order.orderStatus}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Link
                          to={`/dashboard/orders/${order._id}/details`}
                          className="p-2 text-blue-600 transition-colors rounded-lg hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900"
                          title="View Details"
                        >
                          <EyeIcon className="w-5 h-5" />
                        </Link>
                        <Link
                          to={`/orders/${order._id}/track`}
                          className="p-2 text-green-600 transition-colors rounded-lg hover:text-green-800 hover:bg-green-50 dark:hover:bg-green-900"
                          title="Track Order"
                        >
                          <TruckIcon className="w-5 h-5" />
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Order Status Tracker */}
                  <div className="p-4 mb-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <h4 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Order Progress</h4>
                    <OrderStatusTracker currentStatus={order.orderStatus} order={order} size="md" />
                  </div>

                  {/* Order Items Preview */}
                  <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-3">
                    {order.items?.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex items-center p-3 space-x-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                        <img
                          src={item.product?.coverImage?.url || item.product?.images?.[0]?.url || '/placeholder.jpg'}
                          alt={item.product?.name}
                          className="object-cover w-12 h-12 rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate dark:text-white">
                            {item.product?.name || 'Product not found'}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                    {order.items?.length > 3 && (
                      <div className="flex items-center justify-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          +{order.items.length - 3} more items
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Order Footer */}
                  <div className="flex flex-col pt-4 border-t border-gray-200 sm:flex-row sm:items-center sm:justify-between dark:border-gray-600">
                    <div className="mb-2 text-sm text-gray-600 dark:text-gray-400 sm:mb-0">
                      {order.items?.length || 0} items • Payment: {order.paymentStatus || 'pending'}
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      ₦{order.totalAmount?.toLocaleString() || '0'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <div className="flex space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    currentPage === page
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-md'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerOrders;