import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import useAuth from '../../hooks/useAuth';
import useFetch from '../../hooks/useFetch';
import ProductCard from '../common/ProductCard';
import LoadingSpinner from '../common/LoadingSpinner';

const Categories = () => {
  const { auth } = useAuth();
  const fetch = useFetch();
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3600/api/';

  // Fetch categories
  const { data: categoriesResponse, isLoading: categoriesLoading } = useQuery(
    'categories',
    async () => {
      return await fetch(`${baseUrl}categories`);
    },
    {
      staleTime: 300000,
      cacheTime: 600000,
      retry: 3
    }
  );

  // console.log(categoriesResponse)
  const categories = categoriesResponse?.data?.data?.categories || [];
  // console.log(categories)

  // Fetch products for each category
  const { data: productsResponse, isLoading: productsLoading } = useQuery(
    ['products-by-categories', categories],
    async () => {
      if (!categories.length) return {};
      
      const productsByCategory = {};
      
      for (const category of categories) {
        try {
          const products = await fetch(
            `${baseUrl}products?category=${category._id}`
          );
          productsByCategory[category._id] = products?.data || [];
        } catch (error) {
          console.error(`Error fetching products for ${category.name}:`, error);
          productsByCategory[category._id] = [];
        }
      }
      
      return productsByCategory;
    },
    {
      enabled: categories.length > 0
    }
  );
  console.log(productsResponse)

  if (categoriesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!categories.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">No Categories Found</h2>
          <p className="text-gray-600">Categories will appear here once they are added.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">Shop by Categories</h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            Discover our wide range of products organized by categories
          </p>
        </div>

        {/* Categories Sections */}
        <div className="space-y-16">
          {categories.map((category) => {
            const categoryProducts = productsResponse?.[category._id] || [];
            console.log(categoryProducts)

            return (
              <section key={category._id} className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-2xl">
                {/* Category Header */}
                <div className="px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="mb-2 text-3xl font-bold text-white">{category.name}</h2>
                      {category.description && (
                        <p className="text-lg text-blue-100">{category.description}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="px-4 py-2 font-medium text-white rounded-full bg-white/20 backdrop-blur-sm">
                        {categoryProducts.length} Products
                      </span>
                    </div>
                  </div>
                </div>

                {/* Products Grid */}
                <div className="p-8">
                  {productsLoading ? (
                    <div className="flex justify-center py-12">
                      <LoadingSpinner />
                    </div>
                  ) : categoryProducts?.data?.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                      {categoryProducts?.data?.map((product) => (
                        <ProductCard key={product._id} product={product} />
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center">
                      <div className="flex items-center justify-center w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <h3 className="mb-2 text-lg font-medium text-gray-900">No Products Available</h3>
                      <p className="text-gray-600">Products in this category will appear here soon.</p>
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Categories;