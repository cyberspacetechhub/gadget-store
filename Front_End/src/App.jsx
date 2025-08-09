import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
// import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

// Create QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Layout Components
import Layout from './components/home/Layout';
import AdminLayout from './components/admin/subcomponents/AdminLayout';
// import VendorLayout from './components/layout/VendorLayout';
import CustomerLayout from './components/customer/CustomerLayout';

// Loading Components
import LoadingSpinner from './components/common/LoadingSpinner';
import PageLoader from './components/common/PageLoader';
import PersistLogin from './components/common/PersistLogin';
import ProtectedRoute from './components/common/ProtectedRoute';
import RequireAuth from './hooks/RequireAuth';

// Lazy load pages for better performance
const Home = lazy(() => import('./components/home/Home'));
const Products = lazy(() => import('./components/pages/Products'));
const ProductDetails = lazy(() => import('./components/pages/ProductDetails'));
const RecentProducts = lazy(() => import('./components/pages/RecentProducts'));
const IphonePage = lazy(() => import('./components/pages/IphonePage'));
const Compare = lazy(() => import('./components/utils/Compare'));
const Cart = lazy(() => import('./components/utils/Cart'));
const Checkout = lazy(() => import('./components/utils/Checkout'));
const Login = lazy(() => import('./components/auth/Login'));
const Register = lazy(() => import('./components/auth/Register'));
const ForgotPassword = lazy(() => import('./components/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./components/auth/ResetPassword'));
const CustomerOrders = lazy(() => import('./components/customer/orders/CustomerOrders'));
const OrderDetails = lazy(() => import('./components/customer/orders/OrderDetails'));
const OrderTracking = lazy(() => import('./components/customer/orders/OrderTracking'));
const OrderSuccess = lazy(() => import('./components/pages/OrderSuccess'));
const Wishlist = lazy(() => import('./components/utils/Wishlist'));
const NotFound = lazy(() => import('./views/errors/NotFound'));
const Forbidden = lazy(() => import('./views/errors/Forbidden'));
const AdminNotFound = lazy(() => import('./views/errors/AdminNotFound'));
const AdminForbidden = lazy(() => import('./views/errors/AdminForbidden'));
const CustomerNotFound = lazy(() => import('./views/errors/CustomerNotFound'));
const CustomerForbidden = lazy(() => import('./views/errors/CustomerForbidden'));
const Categories = lazy(() => import('./components/pages/Categories'));

// Admin Pages
const AdminDashboard = lazy(() => import('./components/admin/subcomponents/Dashboard'));
const AdminProducts = lazy(() => import('./components/admin/subcomponents/Products'));
const AdminProductCreate = lazy(() => import('./components/admin/products/ProductCreate'));
const AdminProductEdit = lazy(() => import('./components/admin/products/ProductEdit'));
const AdminProductDetails = lazy(() => import('./components/admin/products/ProductDetails'));
const AdminCategories = lazy(() => import('./components/admin/subcomponents/Categories'));
const AdminCategoryCreate = lazy(() => import('./components/admin/categories/CategoryCreate'));
const AdminCategoryEdit = lazy(() => import('./components/admin/categories/CategoryEdit'));
const AdminCategoryDetails = lazy(() => import('./components/admin/categories/CategoryDetails'));
const AdminOrders = lazy(() => import('./components/admin/subcomponents/Orders'));
const AdminOrderDetails = lazy(() => import('./components/admin/orders/OrderDetails'));
const AdminUsers = lazy(() => import('./components/admin/subcomponents/Users'));
const AdminUserDetails = lazy(() => import('./components/admin/subcomponents/UserDetails'));
const AdminProfile = lazy(() => import('./components/admin/subcomponents/Profile'));
const AdminSettings = lazy(() => import('./components/admin/subcomponents/Settings'));
const AdminAnalytics = lazy(() => import('./components/admin/subcomponents/Analytics'));

// Vendor Pages
// const VendorDashboard = lazy(() => import('./components/pages/vendor/Dashboard'));
// const VendorProducts = lazy(() => import('./pages/vendor/Products'));
// const VendorOrders = lazy(() => import('./pages/vendor/Orders'));
// const VendorAnalytics = lazy(() => import('./pages/vendor/Analytics'));

// Customer Pages
const CustomerDashboard = lazy(() => import('./components/customer/Dashboard'));
const CustomerProfile = lazy(() => import('./components/customer/Profile'));
const CustomerSettings = lazy(() => import('./components/customer/Settings'));



function App() {
  const roles = { Customer: 'Customer', Admin: 'Admin', Vendor: 'Vendor' };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <Suspense fallback={<PageLoader />}>
          <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="products" element={<Products />} />
            <Route path="products/:id" element={<ProductDetails />} />
            <Route path="categories" element={<Categories />} />
            <Route path="deals" element={<Products />} />
            <Route path="new-arrivals" element={<Products />} />
            <Route path="best-sellers" element={<Products />} />
            <Route path="recent-products" element={<RecentProducts />} />
            <Route path="iphone" element={<IphonePage />} />
            <Route path="compare" element={<Compare />} />
            <Route path="cart" element={<Cart />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password/:token" element={<ResetPassword />} />
            <Route path="*" element={<NotFound />} />
            </Route>
            <Route path="unauthorized" element={<Forbidden />} />

            {/* Protected Customer Routes */}
            <Route element={<PersistLogin />}>
              <Route element={<RequireAuth allowedRoles={[roles.Customer]} />}>
                <Route path="/dashboard" element={<CustomerLayout />}>
                <Route index element={<CustomerDashboard />} />
                <Route path="/dashboard/checkout" element={<Checkout />} />
                <Route path="/dashboard/order-success" element={<OrderSuccess />} />
                <Route path="/dashboard/orders" element={<CustomerOrders />} />
                <Route path="/dashboard/orders/:orderId/details" element={<OrderDetails />} />
                <Route path="/dashboard/orders/:orderId/track" element={<OrderTracking />} />
                <Route path="/dashboard/profile" element={<CustomerProfile />} />
                <Route path="/dashboard/settings" element={<CustomerSettings />} />
                <Route path="/dashboard/wishlist" element={<Wishlist />} />
                <Route path="*" element={<CustomerNotFound />} />
                </Route>
              </Route>
            </Route>

          {/* Admin Routes */}
          <Route element={<PersistLogin />}>
            <Route element={<RequireAuth allowedRoles={[roles.Admin]} />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="products/create" element={<AdminProductCreate />} />
                <Route path="products/:id" element={<AdminProductDetails />} />
                <Route path="products/:id/edit" element={<AdminProductEdit />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="categories/create" element={<AdminCategoryCreate />} />
                <Route path="categories/:id" element={<AdminCategoryDetails />} />
                <Route path="categories/:id/edit" element={<AdminCategoryEdit />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="orders/:orderId" element={<AdminOrderDetails />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="users/:userId" element={<AdminUserDetails />} />
                <Route path="profile" element={<AdminProfile />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="analytics" element={<AdminAnalytics />} />
                <Route path="*" element={<AdminNotFound />} />
              </Route>
            </Route>
          </Route>

          {/* Vendor Routes */}
          {/* <Route element={<PersistLogin />}>
            <Route element={<RequireAuth allowedRoles={[roles.Vendor]} />}>
              <Route path="/vendor" element={<VendorLayout />}>
                <Route index element={<VendorDashboard />} />
                <Route path="dashboard" element={<VendorDashboard />} />
                <Route path="products" element={<VendorProducts />} />
                <Route path="orders" element={<VendorOrders />} />
                <Route path="analytics" element={<VendorAnalytics />} />
              </Route>
            </Route>
          </Route> */}
          </Routes>
        </Suspense>
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;