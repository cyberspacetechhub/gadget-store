import { useProducts } from '../../hooks/useProducts';
import ProductCard from '../common/ProductCard';

const RecentProducts = () => {
  const { data, isLoading, error } = useProducts();
  console.log(data)
  const products = data?.products?.slice(0, 12) || [];
  console.log(products)

  if (isLoading) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg animate-pulse h-80"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container px-4 py-8 mx-auto text-center">
        <p className="text-red-600">Error loading products</p>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Recent Products</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      {products.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-gray-500">No products found</p>
        </div>
      )}
    </div>
  );
};

export default RecentProducts;