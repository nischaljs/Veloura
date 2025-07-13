import LandingPage from '../pages/LandingPage';
import RegisterWithBusinessForm from '../components/auth/RegisterWithBusinessForm';
import RegisterForm from '../components/auth/RegisterForm';
import LoginForm from '../components/auth/LoginForm';
import ProductDetailPage from '../pages/ProductDetailPage';
import SearchResultsPage from '../pages/SearchResultsPage';
import CartPage from '../pages/CartPage';
import OrderPage from '../pages/OrderPage';
import OrderSuccessPage from '../pages/OrderSuccessPage';
import DashboardPage from '../pages/DashboardPage';
import AdminDashboardPage from '../pages/AdminDashboardPage';
import VendorDashboardPage from '../pages/VendorDashboardPage';
import OrdersPage from '../pages/OrdersPage';
import VendorProfilePage from '../pages/VendorProfilePage';
import VendorBankDetailsPage from '../pages/VendorBankDetailsPage';
import VendorPoliciesPage from '../pages/VendorPoliciesPage';
import VendorAnalyticsPage from '../pages/VendorAnalyticsPage';
import VendorProductsPage from '../pages/VendorProductsPage';
import VendorRegistrationPage from '../pages/VendorRegistrationPage';
import VendorOrderDetailPage from '../pages/VendorOrderDetailPage';
import VendorReviewsPage from '../pages/VendorReviewsPage';
import AdminUsersPage from '../pages/AdminUsersPage';
import AdminVendorsPage from '../pages/AdminVendorsPage';
import AdminProductsPage from '../pages/AdminProductsPage';
import AdminSettingsPage from '../pages/AdminSettingsPage';
import AdminAnalyticsPage from '../pages/AdminAnalyticsPage';

import TestPage from '../pages/TestPage';
import AdminOrdersPage from '../pages/AdminOrdersPage';
import AdminCategoriesPage from '../pages/AdminCategoriesPage';
import AdminBrandsPage from '../pages/AdminBrandsPage';
import AdminCouponsPage from '../pages/AdminCouponsPage';
import NotFoundPage from '../pages/NotFoundPage';
import PublicVendorProfilePage from '../pages/PublicVendorProfilePage';
import CategoryPage from '../pages/CategoryPage';
import CategoryDetailPage from '../pages/CategoryDetailPage';
import BrandDetailPage from '../pages/BrandDetailPage';

import ProtectedRoute from '../components/auth/ProtectedRoute'; // Import the ProtectedRoute component

const routes = [
  {
    path: '/',
    element: <LandingPage/>,
  },
  {
    path: '/register-business',
    element: <RegisterWithBusinessForm/>,
  },
  {
    path: '/register',
    element: <RegisterForm/>,
  },
  {
    path: '/login',
    element: <LoginForm/>,
  },
  {
    path: '/products/:slug',
    element: <ProductDetailPage/>,
  },
  {
    path: '/search',
    element: <SearchResultsPage/>,
  },
  {
    path: '/cart',
    element: <CartPage/>,
  },
  {
    path: '/checkout',
    element: <OrderPage/>,
  },
  {
    path: '/orders/success',
    element: <OrderSuccessPage/>,
  },
  {
    path: '/dashboard',
    element: <ProtectedRoute allowedRoles={['CUSTOMER']}><DashboardPage/></ProtectedRoute>,
  },
  {
    path: '/admin/dashboard',
    element: <ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboardPage/></ProtectedRoute>,
  },
  {
    path: '/admin/users',
    element: <ProtectedRoute allowedRoles={['ADMIN']}><AdminUsersPage/></ProtectedRoute>,
  },
  {
    path: '/admin/vendors',
    element: <ProtectedRoute allowedRoles={['ADMIN']}><AdminVendorsPage/></ProtectedRoute>,
  },
  {
    path: '/admin/products',
    element: <ProtectedRoute allowedRoles={['ADMIN']}><AdminProductsPage/></ProtectedRoute>,
  },
  {
    path: '/admin/settings',
    element: <ProtectedRoute allowedRoles={['ADMIN']}><AdminSettingsPage/></ProtectedRoute>,
  },
  {
    path: '/admin/analytics',
    element: <ProtectedRoute allowedRoles={['ADMIN']}><AdminAnalyticsPage/></ProtectedRoute>,
  },
  
  {
    path: '/admin/orders',
    element: <ProtectedRoute allowedRoles={['ADMIN']}><AdminOrdersPage/></ProtectedRoute>,
  },
  {
    path: '/admin/categories',
    element: <ProtectedRoute allowedRoles={['ADMIN']}><AdminCategoriesPage/></ProtectedRoute>,
  },
  {
    path: '/admin/brands',
    element: <ProtectedRoute allowedRoles={['ADMIN']}><AdminBrandsPage/></ProtectedRoute>,
  },
  {
    path: '/admin/coupons',
    element: <ProtectedRoute allowedRoles={['ADMIN']}><AdminCouponsPage/></ProtectedRoute>,
  },
  {
    path: '/category/:slug',
    element: <CategoryPage />,
  },
  {
    path: '/category/:slug',
    element: <CategoryDetailPage />,
  },
  {
    path: '/brand/:slug',
    element: <BrandDetailPage />,
  },
  {
    path: '/vendor/dashboard',
    element: <ProtectedRoute allowedRoles={['VENDOR']}><VendorDashboardPage/></ProtectedRoute>,
  },
  {
    path: '/orders',
    element: <ProtectedRoute allowedRoles={['CUSTOMER', 'VENDOR', 'ADMIN']}><OrdersPage/></ProtectedRoute>,
  },
  {
    path: '/vendor/orders/:id',
    element: <ProtectedRoute allowedRoles={['VENDOR']}><VendorOrderDetailPage /></ProtectedRoute>,
  },
  {
    path: '/vendor/profile',
    element: <ProtectedRoute allowedRoles={['VENDOR']}><VendorProfilePage/></ProtectedRoute>,
  },
  {
    path: '/vendor/bank-details',
    element: <ProtectedRoute allowedRoles={['VENDOR']}><VendorBankDetailsPage/></ProtectedRoute>,
  },
  {
    path: '/vendor/policies',
    element: <ProtectedRoute allowedRoles={['VENDOR']}><VendorPoliciesPage/></ProtectedRoute>,
  },
  {
    path: '/vendor/analytics',
    element: <ProtectedRoute allowedRoles={['VENDOR']}><VendorAnalyticsPage/></ProtectedRoute>,
  },
  {
    path: '/vendor/products',
    element: <ProtectedRoute allowedRoles={['VENDOR']}><VendorProductsPage /></ProtectedRoute>,
  },
  {
    path: '/vendor/register',
    element: <ProtectedRoute allowedRoles={['CUSTOMER']}><VendorRegistrationPage /></ProtectedRoute>, // Only customers can register as vendors
  },
  {
    path: '/vendor/orders',
    element: <ProtectedRoute allowedRoles={['VENDOR']}><OrdersPage /></ProtectedRoute>,
  },
  {
    path: '/vendor/reviews',
    element: <ProtectedRoute allowedRoles={['VENDOR']}><VendorReviewsPage /></ProtectedRoute>,
  },
  {
    path: '/vendors/:slug',
    element: <PublicVendorProfilePage />,
  },
  {
    path: '/test',
    element: <TestPage />,
  },
  {
    path: '/404',
    element: <NotFoundPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  }
];

export default routes;
 