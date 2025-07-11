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
    element: <DashboardPage/>,
  },
  {
    path: '/admin/dashboard',
    element: <AdminDashboardPage/>,
  },
  {
    path: '/admin/users',
    element: <AdminUsersPage/>,
  },
  {
    path: '/admin/vendors',
    element: <AdminVendorsPage/>,
  },
  {
    path: '/admin/products',
    element: <AdminProductsPage/>,
  },
  {
    path: '/admin/settings',
    element: <AdminSettingsPage/>,
  },
  {
    path: '/admin/analytics',
    element: <AdminAnalyticsPage/>,
  },
  
  {
    path: '/admin/orders',
    element: <AdminOrdersPage/>,
  },
  {
    path: '/admin/categories',
    element: <AdminCategoriesPage/>,
  },
  {
    path: '/admin/brands',
    element: <AdminBrandsPage/>,
  },
  {
    path: '/admin/coupons',
    element: <AdminCouponsPage/>,
  },
  {
    path: '/vendor/dashboard',
    element: <VendorDashboardPage/>,
  },
  {
    path: '/orders',
    element: <OrdersPage/>,
  },
  {
    path: '/vendor/orders/:id',
    element: <VendorOrderDetailPage />,
  },
  {
    path: '/vendor/profile',
    element: <VendorProfilePage/>,
  },
  {
    path: '/vendor/bank-details',
    element: <VendorBankDetailsPage/>,
  },
  {
    path: '/vendor/policies',
    element: <VendorPoliciesPage/>,
  },
  {
    path: '/vendor/analytics',
    element: <VendorAnalyticsPage/>,
  },
  {
    path: '/vendor/products',
    element: <VendorProductsPage />,
  },
  {
    path: '/vendor/register',
    element: <VendorRegistrationPage />,
  },
  {
    path: '/vendor/orders',
    element: <OrdersPage />,
  },
  {
    path: '/vendor/reviews',
    element: <VendorReviewsPage />,
  },
  {
    path: '/test',
    element: <TestPage />,
  }
];

export default routes;
 