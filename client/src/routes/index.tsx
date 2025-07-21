import LandingPage from '../pages/LandingPage';
import RegisterForm from '../components/auth/RegisterForm';
import LoginForm from '../components/auth/LoginForm';
import ProductDetailPage from '../pages/ProductDetailPage';
import CartPage from '../pages/CartPage';
import OrderPage from '../pages/OrderPage';
import OrderSuccessPage from '../pages/OrderSuccessPage';
import OrdersPage from '../pages/OrdersPage';
import CustomerOrdersPage from '../pages/CustomerOrdersPage';
import NotFoundPage from '../pages/NotFoundPage';
import PublicVendorProfilePage from '../pages/PublicVendorProfilePage';
import CategoryPage from '../pages/CategoryPage';
import CategoryDetailPage from '../pages/CategoryDetailPage';
import VendorAddProductPage from '../pages/VendorAddProductPage';
import VendorRegisterPage from '../pages/VendorRegisterPage';
import VendorReviewsPage from '../pages/VendorReviewsPage';

import ProtectedRoute from '../components/auth/ProtectedRoute';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import AdminDashboardPage from '../pages/AdminDashboardPage';
import AdminUsersPage from '../pages/AdminUsersPage';
import AdminVendorsPage from '../pages/AdminVendorsPage';
import AdminProductsPage from '../pages/AdminProductsPage';
import AdminOrdersPage from '../pages/AdminOrdersPage';
import AdminCategoriesPage from '../pages/AdminCategoriesPage';
import AdminPayoutsPage from '../pages/AdminPayoutsPage';
import VendorDashboardPage from '../pages/VendorDashboardPage';
import VendorProductsPage from '../pages/VendorProductsPage';
import VendorOrdersPage from '../pages/VendorOrdersPage';
import VendorPayoutsPage from '../pages/VendorPayoutsPage';
import VendorProfilePage from '../pages/VendorProfilePage';
import CustomerDashboardPage from '../pages/CustomerDashboardPage';
import CustomerProfilePage from '../pages/CustomerProfilePage';

const routes = [
  {
    path: '/',
    element: <LandingPage/>,
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
    path: '/orders',
    element: <ProtectedRoute allowedRoles={['CUSTOMER', 'VENDOR', 'ADMIN']} children={<OrdersPage />} />,
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
    path: '/vendors/:slug',
    element: <PublicVendorProfilePage />,
  },
  {
    path: '/vendor/register',
    element: <VendorRegisterPage/>,
  },
  {
    path: '/vendor/reviews',
    element: <ProtectedRoute allowedRoles={['VENDOR']} children={<VendorReviewsPage />} />,
  },
  {
    path: '/dashboard',
    element: <ProtectedRoute allowedRoles={['CUSTOMER']} children={<DashboardLayout />} />,
    children: [
      {
        index: true,
        element: <CustomerDashboardPage />
      },
      {
        path: 'profile',
        element: <CustomerProfilePage />
      },
      {
        path: 'orders',
        element: <CustomerOrdersPage />
      }
    ]
  },
  {
    path: '/vendor/*',
    element: <ProtectedRoute allowedRoles={['VENDOR']} children={<DashboardLayout />} />,
    children: [
      { path: 'dashboard', element: <VendorDashboardPage /> },
      { path: 'products', element: <VendorProductsPage /> },
      { path: 'products/add', element: <VendorAddProductPage /> },
      { path: 'orders', element: <VendorOrdersPage /> },
      { path: 'payouts', element: <VendorPayoutsPage /> },
      { path: 'profile', element: <VendorProfilePage /> },
      { path: 'reviews', element: <VendorReviewsPage /> },
      { path: '*', element: <VendorDashboardPage /> },
    ]
  },
  {
    path: '/admin/*',
    element: <ProtectedRoute allowedRoles={['ADMIN']} children={<DashboardLayout />} />,
    children: [
      { path: 'dashboard', element: <AdminDashboardPage /> },
      { path: '*', element: <AdminDashboardPage /> },
    ]
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
