import { Link } from 'react-router-dom';
import { ShoppingCartIcon, HeartIcon, ArrowRightIcon, TruckIcon, ShieldCheckIcon, CpuChipIcon } from '@heroicons/react/24/outline';
import { useFeaturedProducts, useProducts } from '../../hooks/useProducts';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ProductCard from '../common/ProductCard';
import RecentProducts from '../pages/RecentProducts';
import IphonePage from '../pages/IphonePage';

const Home = () => {
  const { data: featuredProducts, isLoading } = useFeaturedProducts({ limit: 8 });
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const handleAddToCart = (product) => {
    addToCart.mutate({
      productId: product._id,
      quantity: 1
    });
  };

  const handleAddToWishlist = (productId) => {
    addToWishlist.mutate(productId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white space-y-8">
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                Next-Gen
                <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  Gadgets
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-blue-100 leading-relaxed">
                Discover cutting-edge technology that transforms your digital lifestyle
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/products"
                  className="px-8 py-4 bg-white text-blue-600 font-bold rounded-full hover:bg-blue-50 transform hover:scale-105 transition-all duration-300 shadow-xl"
                >
                  Explore Collection
                </Link>
                <Link
                  to="/deals"
                  className="px-8 py-4 border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-blue-600 transition-all duration-300"
                >
                  View Deals
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop&crop=center"
                  alt="Premium Smartphone"
                  className="rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500"
                />
                <img
                  src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop&crop=center"
                  alt="Modern Laptop"
                  className="rounded-2xl shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500 mt-8"
                />
                <img
                  src="https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=300&fit=crop&crop=center"
                  alt="Wireless Headphones"
                  className="rounded-2xl shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500 -mt-4"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Featured Products
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Handpicked premium gadgets that define innovation
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {featuredProducts?.products?.slice(0, 8).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
        
        <div className="text-center mt-12">
          <Link
            to="/products"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-full hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            View All Products
            <ArrowRightIcon className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>

      {/* Recent Products Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Latest Arrivals
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Fresh tech just landed - be the first to experience innovation
          </p>
        </div>
        <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-8 shadow-2xl">
          <RecentProducts />
        </div>
        <div className="text-center mt-8">
          <Link
            to="/recent-products"
            className="inline-flex items-center px-6 py-3 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
          >
            View All Recent Products
            <ArrowRightIcon className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </section>

      {/* iPhone Products Section */}
      <section className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              iPhone Collection
            </h2>
            <p className="text-xl text-blue-200">
              Discover the power of Apple's latest innovations
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
            <IphonePage />
          </div>
          <div className="text-center mt-8">
            <Link
              to="/iphone"
              className="inline-flex items-center px-8 py-4 bg-white text-gray-900 font-bold rounded-full hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-xl"
            >
              Explore iPhone Collection
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white dark:bg-gray-800 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose GadgetStore?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Experience excellence in every aspect of your shopping journey
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-xl">
                  <TruckIcon className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Lightning Fast Delivery
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Get your cutting-edge gadgets delivered in record time with our premium express shipping network
              </p>
            </div>
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-xl">
                  <ShieldCheckIcon className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -inset-4 bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Premium Quality
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Every product undergoes rigorous quality testing to ensure you receive only the finest technology
              </p>
            </div>
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-xl">
                  <CpuChipIcon className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -inset-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Expert Support
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Our tech specialists provide 24/7 support to help you make the most of your gadgets
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;