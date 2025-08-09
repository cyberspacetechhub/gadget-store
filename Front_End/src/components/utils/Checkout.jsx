import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { CreditCardIcon, TruckIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { useCart } from '../../hooks/useCart';
import { useOrders } from '../../hooks/useOrders';
import useAuth from '../../hooks/useAuth';
import PaymentModal from '../payment/PaymentModal';
import { nigerianStates, getDeliveryFee, getAvailablePaymentMethods } from './states';
import toast from 'react-hot-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const { data: cart } = useCart();
  const { createOrder } = useOrders();

  console.log(cart)
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const selectedState = watch('state');

  const cartItems = cart?.items || [];
  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.price || item.product?.price || 0;
    const quantity = item.quantity || 0;
    return sum + (price * quantity);
  }, 0);
  
  const deliveryFee = getDeliveryFee(selectedState);
  const total = subtotal + deliveryFee;
  const availablePaymentMethods = getAvailablePaymentMethods(selectedState);

  useEffect(() => {
    if (!auth?.accessToken) {
      navigate('/login?redirect=/checkout');
    }
  }, [auth?.accessToken, navigate]);

  useEffect(() => {
    if (auth?.accessToken && cartItems.length === 0 && cart) {
      navigate('/cart');
    }
  }, [cartItems.length, cart, auth?.accessToken, navigate]);

  useEffect(() => {
    if (!availablePaymentMethods.includes(paymentMethod)) {
      setPaymentMethod(availablePaymentMethods[0] || 'card');
    }
  }, [availablePaymentMethods, paymentMethod]);

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

  if (!auth?.accessToken) {
    return (
      <div className="container px-4 py-8 mx-auto text-center">
        <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-blue-600 rounded-full animate-spin"></div>
        <p>Redirecting to login...</p>
      </div>
    );
  }

  if (!cart) {
    return (
      <div className="container px-4 py-8 mx-auto text-center">
        <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-blue-600 rounded-full animate-spin"></div>
        <p>Loading cart...</p>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Checkout</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center mb-6 space-x-2">
              <MapPinIcon className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Shipping Address</h2>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">First Name *</label>
                <input
                  {...register('firstName', { required: 'First name is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your first name"
                />
                {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Last Name *</label>
                <input
                  {...register('lastName', { required: 'Last name is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your last name"
                />
                {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Email *</label>
                <input
                  {...register('email', { required: 'Email is required' })}
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Phone *</label>
                <input
                  {...register('phone', { required: 'Phone is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your phone number"
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block mb-2 text-sm font-medium text-gray-700">Street Address *</label>
                <input
                  {...register('street', { required: 'Street address is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your street address"
                />
                {errors.street && <p className="mt-1 text-sm text-red-600">{errors.street.message}</p>}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">City *</label>
                <input
                  {...register('city', { required: 'City is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter city"
                />
                {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">State *</label>
                <select
                  {...register('state', { required: 'State is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select State</option>
                  {nigerianStates.map((state) => (
                    <option key={state.value} value={state.value}>
                      {state.label}
                    </option>
                  ))}
                </select>
                {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">ZIP Code *</label>
                <input
                  {...register('zipCode', { required: 'ZIP code is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter ZIP code"
                />
                {errors.zipCode && <p className="mt-1 text-sm text-red-600">{errors.zipCode.message}</p>}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Country</label>
                <input
                  {...register('country')}
                  defaultValue="Nigeria"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center mb-6 space-x-2">
              <CreditCardIcon className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
            </div>

            <div className="space-y-4">
              {availablePaymentMethods.includes('card') && (
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div className="flex items-center space-x-2">
                    <CreditCardIcon className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">Pay with Card</span>
                  </div>
                </label>
              )}

              {availablePaymentMethods.includes('transfer') && (
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    value="transfer"
                    checked={paymentMethod === 'transfer'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div className="flex items-center space-x-2">
                    <TruckIcon className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">Bank Transfer</span>
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
            
            {selectedState && !availablePaymentMethods.includes('cash_on_delivery') && (
              <div className="p-3 mt-4 border border-yellow-200 rounded-md bg-yellow-50">
                <p className="text-sm text-yellow-800">
                  Cash on Delivery is only available in Ebonyi state.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky p-6 bg-white border border-gray-200 rounded-lg shadow-sm top-4">
            <h2 className="mb-4 text-xl font-bold text-gray-900">Order Summary</h2>

            <div className="mb-6 space-y-4">
              {cartItems.map((item, index) => (
                <div key={item.product?._id || item.productId || index} className="flex items-center space-x-3">
                  <img
                    src={item.product?.coverImage || item.product?.images?.[0] || '/placeholder.jpg'}
                    alt={item.name || item.product?.name}
                    className="object-cover w-12 h-12 rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.name || item.product?.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">₦{((item.price || item.product?.price || 0) * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>

            <div className="pt-4 mb-6 space-y-3 border-t border-gray-200">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-medium">₦{deliveryFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">₦0</span>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-lg font-bold text-gray-900">₦{total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={createOrder.isLoading}
              className="w-full px-4 py-3 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
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