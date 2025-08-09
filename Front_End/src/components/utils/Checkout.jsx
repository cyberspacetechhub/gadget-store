import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { CreditCardIcon, TruckIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { useCart } from '../../hooks/useCart';
import { useOrders } from '../../hooks/useOrders';
import useAuth from '../../hooks/useAuth';
import PaymentModal from '../payment/PaymentModal';
import toast from 'react-hot-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState('paystack');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const { data: cart } = useCart();
  const { createOrder } = useOrders();

  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const watchedState = watch('state');

  const cartItems = cart?.items || [];
  const total = cartItems.reduce((sum, item) => {
    const price = item.price || item.product?.price || 0;
    const quantity = item.quantity || 0;
    return sum + (price * quantity);
  }, 0);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!auth?.accessToken) {
      navigate('/login?redirect=/checkout');
    }
  }, [auth?.accessToken, navigate]);

  // Handle empty cart navigation
  useEffect(() => {
    if (auth?.accessToken && cartItems.length === 0 && cart) {
      navigate('/cart');
    }
  }, [cartItems.length, cart, auth?.accessToken, navigate]);

  const isEbonyiState = watchedState?.toLowerCase() === 'ebonyi';
  const availablePaymentMethods = isEbonyiState 
    ? ['paystack', 'bank_transfer', 'cash_on_delivery'] 
    : ['paystack', 'bank_transfer'];

  useEffect(() => {
    if (!isEbonyiState && paymentMethod === 'cash_on_delivery') {
      setPaymentMethod('paystack');
    }
  }, [isEbonyiState, paymentMethod]);

  const onSubmit = async (data) => {
    const orderPayload = {
      items: cartItems.map(item => ({
        product: item.product?._id || item.productId || item.product,
        name: item.name || item.product?.name,
        image: item.image || item.product?.images?.[0],
        quantity: item.quantity,
        price: item.price || item.product?.price
      })),
      shippingAddress: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        street: data.street,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        country: data.country || 'Nigeria'
      },
      paymentMethod,
      totalAmount: total
    };

    try {
      const order = await createOrder.mutateAsync(orderPayload);
      
      setOrderData({
        orderId: order._id,
        email: data.email,
        amount: total
      });
      setShowPaymentModal(true);
    } catch (error) {
      toast.error('Failed to create order');
    }
  };

  const handlePaymentSuccess = () => {
    toast.success('Order placed successfully!');
    navigate('/dashboard/order-success');
  };

  // Show loading states
  if (!auth?.accessToken) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p>Redirecting to login...</p>
      </div>
    );
  }

  if (!cart) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p>Loading cart...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-6">
              <MapPinIcon className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Shipping Address</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  {...register('firstName', { required: 'First name is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your first name"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  {...register('lastName', { required: 'Last name is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your last name"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  {...register('email', { required: 'Email is required' })}
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone *
                </label>
                <input
                  {...register('phone', { required: 'Phone is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your phone number"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address *
                </label>
                <input
                  {...register('street', { required: 'Street address is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your street address"
                />
                {errors.street && (
                  <p className="mt-1 text-sm text-red-600">{errors.street.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  {...register('city', { required: 'City is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter city"
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <input
                  {...register('state', { required: 'State is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter state"
                />
                {errors.state && (
                  <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP Code *
                </label>
                <input
                  {...register('zipCode', { required: 'ZIP code is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter ZIP code"
                />
                {errors.zipCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.zipCode.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <input
                  {...register('country')}
                  defaultValue="Nigeria"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-6">
              <CreditCardIcon className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
            </div>

            <div className="space-y-4">
              {availablePaymentMethods.includes('paystack') && (
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    value="paystack"
                    checked={paymentMethod === 'paystack'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div className="flex items-center space-x-2">
                    <CreditCardIcon className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">Pay with Card (Paystack)</span>
                  </div>
                </label>
              )}

              {availablePaymentMethods.includes('bank_transfer') && (
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    value="bank_transfer"
                    checked={paymentMethod === 'bank_transfer'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div className="flex items-center space-x-2">
                    <TruckIcon className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">Bank Transfer (Paystack)</span>
                  </div>
                </label>
              )}

              {availablePaymentMethods.includes('cash_on_delivery') && (
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    value="cash_on_delivery"
                    checked={paymentMethod === 'cash_on_delivery'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div className="flex items-center space-x-2">
                    <TruckIcon className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">Cash on Delivery</span>
                  </div>
                </label>
              )}
            </div>
            
            {!isEbonyiState && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  Cash on Delivery is only available for addresses within Ebonyi State.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

            <div className="space-y-4 mb-6">
              {cartItems.map((item, index) => (
                <div key={item.product?._id || item.productId || index} className="flex items-center space-x-3">
                  <img
                    src={item.image || item.product?.images?.[0] || '/placeholder.jpg'}
                    alt={item.name || item.product?.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.name || item.product?.name}</p>
                    <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">₦{((item.price || item.product?.price || 0) * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3 mb-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₦{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">₦0</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-lg font-bold text-gray-900">₦{total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={createOrder.isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {createOrder.isLoading ? 'Creating Order...' : 'Continue to Payment'}
            </button>
          </div>
        </div>
      </form>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        orderData={orderData}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default Checkout;