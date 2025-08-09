import { Link } from 'react-router-dom';
import { TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useCart } from '../../hooks/useCart';
import toast from 'react-hot-toast';

const Cart = () => {
  const { data: cart, updateQuantity, removeFromCart, clearCart } = useCart();

  const cartItems = cart?.items || [];
  const total = cartItems.reduce((sum, item) => {
    const price = item.price || item.product?.price || 0;
    const quantity = item.quantity || 0;
    return sum + (price * quantity);
  }, 0);

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateQuantity.mutate({ productId, quantity: newQuantity });
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await removeFromCart.mutate(productId);
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm('Are you sure you want to clear your cart?')) return;
    try {
      await clearCart.mutate();
      toast.success('Cart cleared');
    } catch (error) {
      toast.error('Failed to clear cart');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container px-4 py-16 mx-auto text-center">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
          </div>
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Your cart is empty</h2>
          <p className="mb-8 text-gray-600">Start shopping to add items to your cart</p>
          <Link
            to="/"
            className="inline-block px-8 py-3 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <button
          onClick={handleClearCart}
          className="font-medium text-red-600 hover:text-red-700"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="space-y-4 lg:col-span-2">
          {cartItems.map((item) => (
            <div key={item.productId} className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="flex items-center space-x-4">
                <img
                  src={item.image || item.product?.coverImage?.url || '/placeholder.jpg'}
                  alt={item.name || item.product?.name}
                  className="object-cover w-20 h-20 rounded-lg"
                />
                
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.name || item.product?.name}</h3>
                  <p className="text-gray-600">{item.brand || item.product?.brand}</p>
                  <p className="mt-1 text-lg font-bold text-gray-900">
                    ₦{(item.price || item.product?.price || 0).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="p-2 hover:bg-gray-100 disabled:opacity-50"
                    >
                      <MinusIcon className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 border-x border-gray-300 min-w-[3rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                      className="p-2 hover:bg-gray-100"
                    >
                      <PlusIcon className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleRemoveItem(item.productId)}
                    className="p-2 text-red-600 hover:text-red-700"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200">
                <span className="text-gray-600">Subtotal:</span>
                <span className="text-xl font-bold text-gray-900">
                  ₦{((item.price || item.product?.price || 0) * item.quantity).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky p-6 bg-white border border-gray-200 rounded-lg shadow-sm top-4">
            <h2 className="mb-4 text-xl font-bold text-gray-900">Order Summary</h2>
            
            <div className="mb-6 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
                <span className="font-medium">₦{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">Free</span>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-lg font-bold text-gray-900">₦{total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <Link
              to="/dashboard/checkout"
              className="block w-full px-4 py-3 font-medium text-center text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Proceed to Checkout
            </Link>

            <Link
              to="/"
              className="block w-full px-4 py-3 mt-3 font-medium text-center text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;