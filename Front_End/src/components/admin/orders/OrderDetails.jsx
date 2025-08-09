import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, PrinterIcon, TruckIcon, UserIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { useQuery } from 'react-query';
import useFetch from '../../../hooks/useFetch';
import useAuth from '../../../hooks/useAuth';
import LoadingSpinner from '../../common/LoadingSpinner';

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const fetch = useFetch();

  const { data, isLoading } = useQuery(
    ['admin-order', orderId],
    async () => {
      return await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3600/api/'}orders/${orderId}`,
        auth.accessToken
      );
    },
    { enabled: !!orderId && !!auth.accessToken }
  );

  const order = data?.data?.data;
  console.log(order);
  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'confirmed': 'bg-blue-100 text-blue-800 border-blue-200',
      'processing': 'bg-purple-100 text-purple-800 border-purple-200',
      'shipped': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'delivered': 'bg-green-100 text-green-800 border-green-200',
      'cancelled': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-12 text-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Order not found</h3>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin/orders')}
            className="p-2 text-gray-400 transition-colors rounded-lg hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Order #{order.orderNumber}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
            {order.orderStatus}
          </span>
          <button className="p-2 text-gray-600 transition-colors rounded-lg hover:text-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700">
            <PrinterIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Order Items */}
        <div className="space-y-6 lg:col-span-2">
          <div className="p-6 bg-white shadow-xl dark:bg-gray-800 rounded-2xl">
            <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">Order Items</h2>
            <div className="space-y-4">
              {order.items?.map((item, index) => (
                <div key={index} className="flex items-center p-4 space-x-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <img
                    src={item.product?.coverImage?.url || item.product?.images?.[0]?.url || '/placeholder.jpg'}
                    alt={item.product?.name}
                    className="object-cover w-16 h-16 rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {item.product?.name || 'Product not found'}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      ₦{item.price.toLocaleString()} each
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Timeline */}
          <div className="p-6 bg-white shadow-xl dark:bg-gray-800 rounded-2xl">
            <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">Order Timeline</h2>
            <div className="space-y-4">
              {order.statusHistory?.map((status, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 capitalize dark:text-white">
                        {status.status}
                      </h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(status.date).toLocaleString()}
                      </span>
                    </div>
                    {status.notes && (
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {status.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary & Customer Info */}
        <div className="space-y-6">
          {/* Customer Information */}
          <div className="p-6 bg-white shadow-xl dark:bg-gray-800 rounded-2xl">
            <h2 className="flex items-center mb-6 text-xl font-bold text-gray-900 dark:text-white">
              <UserIcon className="w-5 h-5 mr-2" />
              Customer Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</label>
                <p className="text-gray-900 dark:text-white">{`${order.user?.firstName} ${order.user?.lastName}` || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                <p className="text-gray-900 dark:text-white">{order.user?.email || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</label>
                <p className="text-gray-900 dark:text-white">{order.user?.phone || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="p-6 bg-white shadow-xl dark:bg-gray-800 rounded-2xl">
            <h2 className="flex items-center mb-6 text-xl font-bold text-gray-900 dark:text-white">
              <MapPinIcon className="w-5 h-5 mr-2" />
              Shipping Address
            </h2>
            <div className="text-gray-900 dark:text-white">
              {order.shippingAddress ? (
                <div className="space-y-1">
                  <p>{order.shippingAddress.street}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                  <p>{order.shippingAddress.zipCode}</p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No shipping address provided</p>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="p-6 bg-white shadow-xl dark:bg-gray-800 rounded-2xl">
            <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="text-gray-900 dark:text-white">₦{order.subtotal?.toLocaleString() || '0'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                <span className="text-gray-900 dark:text-white">₦{order.shippingCost?.toLocaleString() || '0'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Tax</span>
                <span className="text-gray-900 dark:text-white">₦{order.tax?.toLocaleString() || '0'}</span>
              </div>
              <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                <div className="flex justify-between">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    ₦{order.totalAmount?.toLocaleString() || '0'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="p-6 bg-white shadow-xl dark:bg-gray-800 rounded-2xl">
            <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">Payment Information</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Payment Method</span>
                <span className="text-gray-900 capitalize dark:text-white">
                  {order.paymentMethod || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Payment Status</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  order.paymentStatus === 'paid' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.paymentStatus || 'pending'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;