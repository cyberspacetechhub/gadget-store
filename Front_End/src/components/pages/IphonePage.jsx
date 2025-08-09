import { useQuery } from 'react-query';
import { useProducts } from '../../hooks/useProducts';
import ProductCard from '../common/ProductCard';
import useFetch from '../../hooks/useFetch';
import useAuth from '../../hooks/useAuth';

const IphonePage = () => {
  const { auth } = useAuth();
  const fetch = useFetch();

  // Get iPhone category ID
  const { data: categoriesData } = useQuery(
    ['categories'],
    async () => {
      const result = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3600/api/'}categories`, auth.accessToken);
      console.log(result)
      const categories = result.data?.data?.categories || [];
      return Array.isArray(categories) ? categories : [];
    },
    { enabled: !!auth.accessToken }
  );
  console.log(categoriesData)
  const iphoneCategory = categoriesData?.find(cat => 
    cat.name?.toLowerCase().includes('iphone') || cat.name?.toLowerCase().includes('smartphone')
  );

  console.log(iphoneCategory)

  // Get products by iPhone category
  const { data, isLoading, error } = useQuery(
    ['products', iphoneCategory?._id],
    async () => {
      if (!iphoneCategory?._id) return { products: [] };
      const result = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3600/api/'}products/category/${iphoneCategory._id}`,
        auth.accessToken
      );
      console.log(result)
      return { products: result.data?.data || [] };
    },
    { enabled: !!iphoneCategory?._id && !!auth.accessToken }
  );
console.log(data)
  const products = data?.products || [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-lg animate-pulse h-80"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <p className="text-white">Error loading iPhone products</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      {products.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-white">No iPhone products found</p>
        </div>
      )}
    </div>
  );
};

export default IphonePage;