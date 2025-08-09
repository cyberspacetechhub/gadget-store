import { Link } from 'react-router-dom';
import { HeartIcon, ShoppingCartIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useWishlist } from '../../hooks/useWishlist';
import { useCart } from '../../hooks/useCart';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const { data: wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const wishlistItems = wishlist?.items || [];

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await removeFromWishlist.mutate(productId);
      toast.success('Removed from wishlist');
    } catch (error) {
      toast.error('Failed to remove from wishlist');
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await addToCart.mutate({ productId, quantity: 1 });
      toast.success('Added to cart');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <HeartIcon className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-8">Save items you love to your wishlist</p>
          <Link
            to="/"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistItems.map((item) => (
          <div key={item.productId} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group">
            <div className="relative">
              <Link to={`/products/${item.productId}`}>
                <img
                  src={item.product?.images?.[0]?.url || item.product?.images?.[0] || '/placeholder.jpg'}
                  alt={item.product?.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <button
                onClick={() => handleRemoveFromWishlist(item.productId)}
                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
              >
                <TrashIcon className="w-4 h-4 text-red-500" />
              </button>
            </div>

            <div className="p-4">
              <Link to={`/products/${item.productId}`}>
                <h3 className="font-semibold text-gray-900 mb-1 hover:text-blue-600 transition-colors line-clamp-2">
                  {item.product?.name}
                </h3>
              </Link>
              <p className="text-gray-600 text-sm mb-2">{item.product?.brand}</p>
              
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-lg font-bold text-gray-900">
                    ₦{item.product?.price?.toLocaleString()}
                  </span>
                  {item.product?.comparePrice && item.product.comparePrice > item.product.price && (
                    <span className="text-sm text-gray-500 line-through ml-2">
                      ₦{item.product.comparePrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleAddToCart(item.productId)}
                  disabled={addToCart.isLoading}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <ShoppingCartIcon className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;