import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  HeartIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline';
import { useProducts } from '../../hooks/useProducts';
import { useCart } from '../../hooks/useCart';
import { useAddToWishlist } from '../../hooks/useWishlist';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);

  const params = {
    page: currentPage,
    limit: 12,
    search: searchTerm || undefined,
    category: categoryFilter || undefined,
    priceRange: priceRange || undefined,
    sortBy
  };

  const { data, isLoading, error } = useProducts(params);
  const { addToCart } = useCart();
  const addToWishlist = useAddToWishlist();

  const products = data?.products || [];
  const totalPages = data?.total ? Math.ceil(data.total / 12) : 1;

  const handleAddToCart = (product) => {
    addToCart.mutate({
      productId: product._id,
      quantity: 1
    });
  };

  const handleAddToWishlist = (productId) => {
    addToWishlist.mutate(productId);
  };

  if (error) {
    return (
      <div className="py-8 container-responsive">
        <div className="text-center">
          <p className="text-red-600">Failed to load products. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 container-responsive">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Products</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute w-5 h-5 text-gray-400 left-3 top-3" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="name">Name</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
            <option value="-createdAt">Newest</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      </div>

      {/* Filters */}
      <div className="p-6 mb-8 bg-white rounded-lg shadow dark:bg-gray-800">
        <div className="flex items-center space-x-4">
          <FunnelIcon className="w-5 h-5 text-gray-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">All Categories</option>
            <option value="smartphones">Smartphones</option>
            <option value="laptops">Laptops</option>
            <option value="tablets">Tablets</option>
            <option value="accessories">Accessories</option>
          </select>
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">All Prices</option>
            <option value="0-50000">₦0 - ₦50,000</option>
            <option value="50000-200000">₦50,000 - ₦200,000</option>
            <option value="200000-500000">₦200,000 - ₦500,000</option>
            <option value="500000+">₦500,000+</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : products.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">No products found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <div key={product._id} className="overflow-hidden transition-shadow bg-white rounded-lg shadow-md dark:bg-gray-800 hover:shadow-lg">
                <Link to={`/products/${product._id}`}>
                  <img
                    src={product.images?.[0] || '/placeholder.jpg'}
                    alt={product.name}
                    className="object-cover w-full h-48"
                  />
                </Link>
                <div className="p-4">
                  <Link to={`/products/${product._id}`}>
                    <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white hover:text-indigo-600">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                    {product.brand}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-indigo-600">
                      ₦{product.price?.toLocaleString()}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-gray-500 line-through">
                        ₦{product.originalPrice?.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={addToCart.isLoading}
                      className="flex items-center px-3 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                    >
                      <ShoppingCartIcon className="w-4 h-4 mr-2" />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleAddToWishlist(product._id)}
                      disabled={addToWishlist.isLoading}
                      className="p-2 text-gray-400 hover:text-red-500 disabled:opacity-50"
                    >
                      <HeartIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded-md ${
                    currentPage === page
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Products;