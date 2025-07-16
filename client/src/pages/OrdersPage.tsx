
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const OrdersPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      switch (user.role) {
        case 'CUSTOMER':
          navigate('/dashboard/orders', { replace: true });
          break;
        case 'VENDOR':
          navigate('/vendor/orders', { replace: true });
          break;
        case 'ADMIN':
          navigate('/admin/orders', { replace: true });
          break;
        default:
          navigate('/', { replace: true });
      }
    }
  }, [user, loading, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Redirecting to your orders...</p>
    </div>
  );
};

export default OrdersPage;
