import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import DashboardTable from '../components/dashboard/DashboardTable';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Eye } from 'lucide-react';
import { getVendorOrders } from '../services/order';
import { useNavigate } from 'react-router-dom';
import { Order } from '../types/dashboard';

const VendorOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  const navigate = useNavigate();

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getVendorOrders({ page, limit: pagination.limit });
      setOrders(res.data.data.orders);
      setPagination(res.data.data.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(pagination.page);
    // eslint-disable-next-line
  }, []);

  const orderTableColumns = [
    { key: 'orderNumber', label: 'Order #', render: (value: any) => (
      <span className="font-mono text-sm">{value}</span>
    )},
    { key: 'createdAt', label: 'Date', render: (value: any) => (
      <span className="text-sm">{new Date(value).toLocaleDateString()}</span>
    )},
    { key: 'status', label: 'Status', render: (value: any) => (
      <Badge variant={
        value === 'COMPLETED' ? 'default' : 
        value === 'PENDING' ? 'secondary' : 
        value === 'CANCELLED' ? 'destructive' : 'outline'
      }>
        {value}
      </Badge>
    )},
    { key: 'customer', label: 'Customer', render: (value: any, row: Order) => (
      <span className="text-sm">{row.user ? `${row.user.firstName} ${row.user.lastName}` : 'N/A'}</span>
    )},
    { key: 'items', label: 'Items', render: (value: any, row: Order) => (
      <span className="text-sm">{row.items?.length || 0}</span>
    )},
    { key: 'total', label: 'Total', render: (value: any) => (
      <span className="font-semibold text-indigo-700">Rs.{value?.toLocaleString()}</span>
    )},
    { key: 'actions', label: '', render: (value: any, row: Order) => (
      <Button size="sm" variant="outline" onClick={() => navigate(`/vendor/orders/${row.id}`)}>
        <Eye className="w-4 h-4 mr-1" />
        View
      </Button>
    )}
  ];

  return (
    <DashboardLayout userRole="VENDOR">
      <div className="w-full px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">Vendor Orders</h1>
        <DashboardTable
          title="All Orders"
          data={orders}
          columns={orderTableColumns}
          loading={loading}
          emptyMessage={error || 'No orders found'}
        />
        {/* Pagination Controls */}
        <div className="flex justify-center mt-6 gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page <= 1}
            onClick={() => fetchOrders(pagination.page - 1)}
          >
            Previous
          </Button>
          <span className="px-3 py-2 text-sm">Page {pagination.page} of {pagination.pages}</span>
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page >= pagination.pages}
            onClick={() => fetchOrders(pagination.page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VendorOrdersPage; 