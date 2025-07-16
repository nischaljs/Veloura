import LandingPage from '../pages/LandingPage';
import RegisterForm from '../components/auth/RegisterForm';
import LoginForm from '../components/auth/LoginForm';
import ProductDetailPage from '../pages/ProductDetailPage';
import CartPage from '../pages/CartPage';
import OrderPage from '../pages/OrderPage';
import OrderSuccessPage from '../pages/OrderSuccessPage';
import DashboardPage from '../pages/DashboardPage';
import AdminDashboardPage from '../pages/AdminDashboardPage';
import OrdersPage from '../pages/OrdersPage';
import AdminUsersPage from '../pages/AdminUsersPage';
import AdminProductsPage from '../pages/AdminProductsPage';
import AdminOrdersPage from '../pages/AdminOrdersPage';
import AdminCategoriesPage from '../pages/AdminCategoriesPage';
import NotFoundPage from '../pages/NotFoundPage';
import PublicVendorProfilePage from '../pages/PublicVendorProfilePage';
import CategoryPage from '../pages/CategoryPage';
import CategoryDetailPage from '../pages/CategoryDetailPage';

import ProtectedRoute from '../components/auth/ProtectedRoute'; // Import the ProtectedRoute component

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
    path: '/admin/products',
    element: <ProtectedRoute allowedRoles={['ADMIN']}><AdminProductsPage/></ProtectedRoute>,
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
    path: '/category/:slug',
    element: <CategoryPage />,
  },
  {
    path: '/category/:slug',
    element: <CategoryDetailPage />,
  },
  {
    path: '/orders',
    element: <ProtectedRoute allowedRoles={['CUSTOMER', 'VENDOR', 'ADMIN']}><OrdersPage/></ProtectedRoute>,
  },
  {
    path: '/vendors/:slug',
    element: <PublicVendorProfilePage />,
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