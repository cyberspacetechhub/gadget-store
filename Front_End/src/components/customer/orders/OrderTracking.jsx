import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, PrinterIcon, MapPinIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, ClockIcon, TruckIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { useOrder } from '../../../hooks/useOrders';
import LoadingSpinner from '../../common/LoadingSpinner';

const OrderTracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  
  const { data, isLoading } = useOrder(orderId);
  console.log(data)
  const order = data?.data?.data;

  const orderSteps = [
    { key: 'pending', label: 'Order Placed', icon: ClockIcon, description: 'Your order has been received' },
    { key: 'confirmed', label: 'Confirmed', icon: CheckCircleIcon, description: 'Order confirmed and being prepared' },
    { key: 'processing', label: 'Processing', icon: ClockIcon, description: 'Your items are being packed' },
    { key: 'shipped', label: 'Shipped', icon: TruckIcon, description: 'Your order is on the way' },
    { key: 'delivered', label: 'Delivered', icon: CheckCircleIcon, description: 'Order delivered successfully' }
  ];

  const getStepStatus = (stepKey, currentStatus) => {
    const statusOrder = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(stepKey);
    
    if (currentStatus === 'cancelled') {
      return stepIndex === 0 ? 'completed' : 'cancelled';
    }
    
    if (stepIndex <= currentIndex) return 'completed';
    if (stepIndex === currentIndex + 1) return 'current';
    return 'upcoming';
  };

  const getStepColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500 text-white';
      case 'current': return 'bg-blue-500 text-white animate-pulse';
      case 'cancelled': return 'bg-red-500 text-white';
      default: return 'bg-gray-200 text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <LoadingSpinner />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Order not found</h3>
          <button
            onClick={() => navigate('/dashboard/orders')}
            className="px-6 py-3 text-white transition-colors bg-blue-600 rounded-xl hover:bg-blue-700"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container px-4 mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard/orders')}
              className="p-3 text-gray-400 transition-all shadow-lg hover:text-gray-600 hover:bg-white dark:hover:bg-gray-800 rounded-xl"
            >
              <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 lg:text-4xl dark:text-white">
                Order #{order.orderNumber}
              </h1>
              <p className="flex items-center mt-2 text-gray-600 dark:text-gray-400">
                <CalendarIcon className="w-4 h-4 mr-2" />
                Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
          <button className="p-3 text-gray-600 transition-all shadow-lg hover:text-gray-800 hover:bg-white dark:hover:bg-gray-800 rounded-xl">
            <PrinterIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Order Tracking */}
          <div className="space-y-8 lg:col-span-2">
            {/* Progress Tracker */}
            <div className="p-8 bg-white shadow-2xl dark:bg-gray-800 rounded-3xl">
              <h2 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">Order Progress</h2>
              
              {(order.orderStatus || order.status) === 'cancelled' ? (
                <div className="py-12 text-center">
                  <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full">
                    <XCircleIcon className="w-12 h-12 text-red-500" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-red-600">Order Cancelled</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    This order has been cancelled. If you have any questions, please contact support.
                  </p>
                </div>
              ) : (
                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-gray-200 dark:bg-gray-600"></div>
                  <div 
                    className="absolute left-8 top-8 w-0.5 bg-gradient-to-b from-green-500 to-blue-500 transition-all duration-1000"
                    style={{ 
                      height: `${Math.max(0, (orderSteps.findIndex(step => step.key === (order.orderStatus || order.status)) + 1) * 20)}%` 
                    }}
                  ></div>

                  {/* Steps */}
                  <div className="space-y-8">
                    {orderSteps.map((step, index) => {
                      const status = getStepStatus(step.key, order.orderStatus || order.status);
                      const Icon = step.icon;
                      
                      return (
                        <div key={step.key} className="relative flex items-start space-x-6">
                          <div className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-500 ${getStepColor(status)}`}>
                            <Icon className="w-8 h-8" />
                          </div>
                          <div className="flex-1 pt-2">
                            <div className="flex items-center justify-between">
                              <h3 className={`text-lg font-bold transition-colors ${
                                status === 'completed' || status === 'current' 
                                  ? 'text-gray-900 dark:text-white' 
                                  : 'text-gray-400 dark:text-gray-500'
                              }`}>
                                {step.label}
                              </h3>
                              {(order.statusHistory?.find(h => h.status === step.key) || (step.key === (order.orderStatus || order.status) && order.updatedAt)) && (
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  {new Date(
                                    order.statusHistory?.find(h => h.status === step.key)?.timestamp || 
                                    (step.key === (order.orderStatus || order.status) ? order.updatedAt : order.createdAt)
                                  ).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                            <p className={`text-sm mt-1 transition-colors ${
                              status === 'completed' || status === 'current'
                                ? 'text-gray-600 dark:text-gray-300'
                                : 'text-gray-400 dark:text-gray-500'
                            }`}>
                              {step.description}
                            </p>
                            {(order.statusHistory?.find(h => h.status === step.key)?.notes || 
                              (step.key === (order.orderStatus || order.status) && order.notes)) && (
                              <p className="p-3 mt-2 text-sm text-blue-600 rounded-lg dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20">
                                {order.statusHistory?.find(h => h.status === step.key)?.notes || order.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="p-8 bg-white shadow-2xl dark:bg-gray-800 rounded-3xl">
              <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Order Items</h2>
              <div className="space-y-4">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex items-center p-4 space-x-4 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-blue-900/20 rounded-2xl">
                    <img
                      src={item.product?.coverImage?.url || item.product?.images?.[0]?.url || '/placeholder.jpg'}
                      alt={item.product?.name}
                      className="object-cover w-20 h-20 shadow-lg rounded-xl"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {item.product?.name || 'Product not found'}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {item.product?.brand}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900 dark:text-white">
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
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            {/* Shipping Address */}
            <div className="p-6 bg-white shadow-2xl dark:bg-gray-800 rounded-3xl">
              <h3 className="flex items-center mb-4 text-xl font-bold text-gray-900 dark:text-white">
                <MapPinIcon className="w-5 h-5 mr-2 text-blue-500" />
                Shipping Address
              </h3>
              {order.shippingAddress ? (
                <div className="space-y-1 text-gray-700 dark:text-gray-300">
                  <p className="font-medium">{order.user?.name}</p>
                  <p>{order.shippingAddress.street}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                  <p>{order.shippingAddress.zipCode}</p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No shipping address provided</p>
              )}
            </div>

            {/* Order Summary */}
            <div className="p-6 bg-white shadow-2xl dark:bg-gray-800 rounded-3xl">
              <h3 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">Order Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="font-medium text-gray-900 dark:text-white">₦{order.subtotal?.toLocaleString() || '0'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                  <span className="font-medium text-gray-900 dark:text-white">₦{order.shippingCost?.toLocaleString() || '0'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Tax</span>
                  <span className="font-medium text-gray-900 dark:text-white">₦{order.tax?.toLocaleString() || '0'}</span>
                </div>
                <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex justify-between">
                    <span className="text-xl font-bold text-gray-900 dark:text-white">Total</span>
                    <span className="text-xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                      ₦{order.totalAmount?.toLocaleString() || '0'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="p-6 bg-white shadow-2xl dark:bg-gray-800 rounded-3xl">
              <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Payment Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Method</span>
                  <span className="font-medium text-gray-900 capitalize dark:text-white">
                    {order.paymentMethod || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Status</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.paymentStatus === 'paid' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
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

export default OrderTracking;