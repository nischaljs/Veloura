import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import DashboardTable from '../components/dashboard/DashboardTable';
import { getCoupons, createCoupon, deleteCoupon } from '../services/admin';
import { Coupon } from '../types';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { Input } from '../components/ui/input';

const AdminCouponsPage: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  const [newCouponCode, setNewCouponCode] = useState('');

  const fetchCoupons = async (page = pagination.page) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCoupons({ page, limit: pagination.limit });
      setCoupons(res.data.data.coupons);
      setPagination(res.data.data.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch coupons');
      toast.error(err.response?.data?.message || 'Failed to fetch coupons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async () => {
    if (!newCouponCode) {
      toast.error('Coupon code is required');
      return;
    }
    try {
      await createCoupon({ code: newCouponCode, discountType: 'percentage', discountValue: 10 }); // Add more fields as needed
      toast.success('Coupon created successfully');
      setNewCouponCode('');
      fetchCoupons();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create coupon');
    }
  };

  const handleDeleteCoupon = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    try {
      await deleteCoupon(id);
      toast.success('Coupon deleted successfully');
      fetchCoupons();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete coupon');
    }
  };

  const couponTableColumns = [
    { key: 'code', label: 'Code', render: (value: any) => (
      <div className="font-medium">{value}</div>
    )},
    { key: 'discountType', label: 'Type' },
    { key: 'discountValue', label: 'Value' },
    { key: 'uses', label: 'Uses' },
    { key: 'maxUses', label: 'Max Uses' },
    { key: 'actions', label: 'Actions', render: (value: any, row: Coupon) => (
      <div className="flex gap-2">
        <Button size="sm" variant="destructive" onClick={() => handleDeleteCoupon(row.id)}>Delete</Button>
      </div>
    )},
  ];

  return (
    <DashboardLayout userRole="ADMIN">
      <div className="w-full px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">Coupon Management</h1>
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="New coupon code"
            value={newCouponCode}
            onChange={(e) => setNewCouponCode(e.target.value)}
          />
          <Button onClick={handleCreateCoupon}>Create Coupon</Button>
        </div>
        <DashboardTable
          title="All Coupons"
          data={coupons}
          columns={couponTableColumns}
          loading={loading}
          emptyMessage={error || 'No coupons found'}
        />
        {/* Pagination Controls */}
        <div className="flex justify-center mt-6 gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page <= 1}
            onClick={() => fetchCoupons(pagination.page - 1)}
          >
            Previous
          </Button>
          <span className="px-3 py-2 text-sm">Page {pagination.page} of {pagination.pages}</span>
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page >= pagination.pages}
            onClick={() => fetchCoupons(pagination.page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminCouponsPage;