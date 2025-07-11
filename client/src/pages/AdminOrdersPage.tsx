import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import DashboardTable from '../components/dashboard/DashboardTable';
import { getOrders, updateOrderStatus } from '../services/admin';
import { Order } from '../types';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });

  const fetchOrders = async (page = pagination.page) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getOrders({ page, limit: pagination.limit });
      setOrders(res.data.data.orders);
      setPagination(res.data.data.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
      toast.error(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await updateOrderStatus(id, status);
      toast.success('Order status updated successfully');
      fetchOrders();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update order status');
    }
  };

  const orderTableColumns = [
    { key: 'orderNumber', label: 'Order Number', render: (value: any) => (
      <div className="font-medium">{value}</div>
    )},
    { key: 'customer', label: 'Customer', render: (value: any) => (
      <div>{value.name}</div>
    )},
    { key: 'vendor', label: 'Vendor', render: (value: any) => (
      <div>{value.businessName}</div>
    )},
    { key: 'total', label: 'Total', render: (value: any) => (
      <span>Rs.{value?.toLocaleString()}</span>
    )},
    { key: 'status', label: 'Status', render: (value: any, row: Order) => (
      <Select value={value} onValueChange={(newStatus) => handleStatusChange(row.id, newStatus)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="PENDING">PENDING</SelectItem>
          <SelectItem value="PROCESSING">PROCESSING</SelectItem>
          <SelectItem value="SHIPPED">SHIPPED</SelectItem>
          <SelectItem value="DELIVERED">DELIVERED</SelectItem>
          <SelectItem value="CANCELLED">CANCELLED</SelectItem>
        </SelectContent>
      </Select>
    )},
    { key: 'paymentStatus', label: 'Payment Status', render: (value: any) => (
      <Badge variant={value === 'COMPLETED' ? 'default' : 'destructive'}>
        {value}
      </Badge>
    )},
  ];

  return (
    <DashboardLayout userRole="ADMIN">
      <div className="w-full px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">Order Management</h1>
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

export default AdminOrdersPage;