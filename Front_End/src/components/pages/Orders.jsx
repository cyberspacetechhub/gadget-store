import { Link } from 'react-router-dom';
import { EyeIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useOrders } from '../../hooks/useOrders';
import toast from 'react-hot-toast';

const Orders = () => {
  const { data: ordersData, isLoading, error, cancelOrder } = useOrders();
  const orders = Array.isArray(ordersData) ? ordersData : (ordersData?.orders || []);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    
    try {
      await cancelOrder.mutate(orderId);
      toast.success('Order cancelled successfully');
    } catch (error) {
      toast.error('Failed to cancel order');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container px-4 py-8 mx-auto text-center">
        <p className="text-red-600">Error loading orders</p>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="container px-4 py-16 mx-auto text-center">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="mb-4 text-2xl font-bold text-gray-900">No orders yet</h2>
          <p className="mb-8 text-gray-600">Start shopping to see your orders here</p>
          <Link
            to="/"
            className="inline-block px-8 py-3 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
            {/* Order Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div>
                    <p className="text-sm text-gray-600">Order ID</p>
                    <p className="font-medium">{order._id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-medium">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="font-medium">₦{order.totalAmount?.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  
                  <div className="flex space-x-2">
                    <Link
                      to={`/orders/${order._id}`}
                      className="p-2 text-blue-600 hover:text-blue-700"
                      title="View Details"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </Link>
                    
                    {order.status === 'Pending' && (
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        className="p-2 text-red-600 hover:text-red-700"
                        title="Cancel Order"
                      >
                        <XMarkIcon className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="p-6">
              <div className="space-y-4">
                {order.items?.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <img
                      src={item.product?.images?.[0]?.url || item.product?.images?.[0] || '/placeholder.jpg'}
                      alt={item.product?.name}
                      className="object-cover w-16 h-16 rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.product?.name}</h3>
                      <p className="text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-medium">₦{item.price?.toLocaleString()}</p>
                  </div>
                ))}
                
                {order.items?.length > 3 && (
                  <p className="text-sm text-gray-600">
                    +{order.items.length - 3} more items
                  </p>
                )}
              </div>

              {/* Shipping Address */}
              {order.shippingAddress && (
                <div className="pt-6 mt-6 border-t border-gray-200">
                  <h4 className="mb-2 font-medium text-gray-900">Shipping Address</h4>
                  <p className="text-sm text-gray-600">
                    {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;