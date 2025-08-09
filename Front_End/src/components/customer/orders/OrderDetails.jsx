import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeftIcon, TruckIcon, MapPinIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import { useOrder } from '../../../hooks/useOrders';
import LoadingSpinner from '../../common/LoadingSpinner';
import OrderStatusTracker from '../../common/OrderStatusTracker';

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useOrder(orderId);
  console.log(data)
  const order = data?.data?.data;

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h3 className="mb-4 text-2xl font-bold text-gray-900">Order not found</h3>
          <button
            onClick={() => navigate('/orders')}
            className="px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="container px-4 mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard/orders')}
              className="p-2 text-gray-400 rounded-lg hover:text-gray-600 hover:bg-white"
            >
              <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Order #{order.orderNumber}
              </h1>
              <p className="text-gray-600">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(order.orderStatus || order.status)}`}>
            {(order.orderStatus || order.status).charAt(0).toUpperCase() + (order.orderStatus || order.status).slice(1)}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Order Status */}
            <div className="p-6 bg-white rounded-lg shadow">
              <h2 className="mb-4 text-xl font-bold text-gray-900">Order Status</h2>
              <OrderStatusTracker currentStatus={order.orderStatus || order.status} order={order} size="md" />
              <div className="mt-4">
                <Link
                  to={`/dashboard/orders/${orderId}/track`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  View detailed tracking →
                </Link>
              </div>
            </div>

            {/* Order Items */}
            <div className="p-6 bg-white rounded-lg shadow">
              <h2 className="mb-4 text-xl font-bold text-gray-900">Order Items</h2>
              <div className="space-y-4">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex items-center p-4 space-x-4 border rounded-lg">
                    <img
                      src={item.product?.coverImage?.url || item.product?.images?.[0]?.url || '/placeholder.jpg'}
                      alt={item.product?.name}
                      className="object-cover w-16 h-16 rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {item.product?.name || 'Product not found'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Brand: {item.product?.brand}
                      </p>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">
                        ₦{item.price.toLocaleString()} each
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="p-6 bg-white rounded-lg shadow">
              <h3 className="mb-4 text-lg font-bold text-gray-900">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₦{order.subtotal?.toLocaleString() || '0'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>₦{order.shippingCost?.toLocaleString() || '0'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>₦{order.tax?.toLocaleString() || '0'}</span>
                </div>
                <div className="pt-3 border-t">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-lg font-bold">₦{order.totalAmount?.toLocaleString() || '0'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="p-6 bg-white rounded-lg shadow">
              <h3 className="flex items-center mb-4 text-lg font-bold text-gray-900">
                <MapPinIcon className="w-5 h-5 mr-2" />
                Shipping Address
              </h3>
              {order.shippingAddress ? (
                <div className="space-y-1 text-gray-700">
                  <p className="font-medium">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                  <p>{order.shippingAddress.street}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                  <p>{order.shippingAddress.zipCode}</p>
                  <p>{order.shippingAddress.country}</p>
                  <p className="pt-2 text-sm">{order.shippingAddress.phone}</p>
                </div>
              ) : (
                <p className="text-gray-500">No shipping address provided</p>
              )}
            </div>

            {/* Payment Info */}
            <div className="p-6 bg-white rounded-lg shadow">
              <h3 className="flex items-center mb-4 text-lg font-bold text-gray-900">
                <CreditCardIcon className="w-5 h-5 mr-2" />
                Payment Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Method</span>
                  <span className="font-medium capitalize">{order.paymentMethod || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className={`px-2 py-1 rounded text-sm font-medium ${
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
    </div>
  );
};

export default OrderDetails;