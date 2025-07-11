import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import DashboardTable from '../components/dashboard/DashboardTable';
import { getVendors, approveVendor, rejectVendor, suspendVendor } from '../services/admin';
import { Vendor } from '../types';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';

const AdminVendorsPage: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });

  const fetchVendors = async (page = pagination.page) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getVendors({ page, limit: pagination.limit });
      setVendors(res.data.data.vendors);
      setPagination(res.data.data.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch vendors');
      toast.error(err.response?.data?.message || 'Failed to fetch vendors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleApproveReject = async (id: number, action: 'approve' | 'reject') => {
    try {
      if (action === 'approve') {
        await approveVendor(id);
        toast.success('Vendor approved successfully');
      } else {
        await rejectVendor(id);
        toast.success('Vendor rejected successfully');
      }
      fetchVendors();
    } catch (err: any) {
      toast.error(err.response?.data?.message || `Failed to ${action} vendor`);
    }
  };

  const handleSuspend = async (id: number) => {
    if (!window.confirm('Are you sure you want to suspend this vendor?')) return;
    try {
      await suspendVendor(id);
      toast.success('Vendor suspended successfully');
      fetchVendors();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to suspend vendor');
    }
  };

  const vendorTableColumns = [
    { key: 'businessName', label: 'Business Name', render: (value: any, row: Vendor) => (
      <div>
        <div className="font-medium">{value}</div>
        <div className="text-sm text-muted-foreground">{row.businessEmail}</div>
      </div>
    )},
    { key: 'status', label: 'Status', render: (value: any, row: Vendor) => (
      <Badge variant={row.isApproved ? 'default' : 'secondary'}>
        {row.isApproved ? 'Approved' : 'Pending'}
      </Badge>
    )},
    { key: 'createdAt', label: 'Registered', render: (value: any) => (
      <span className="text-sm text-muted-foreground">
        {new Date(value).toLocaleDateString()}
      </span>
    )},
    { key: 'actions', label: 'Actions', render: (value: any, row: Vendor) => (
      <div className="flex gap-2">
        {!row.isApproved && (
          <Button size="sm" onClick={() => handleApproveReject(row.id, 'approve')}>Approve</Button>
        )}
        {row.isApproved && (
          <Button size="sm" variant="outline" onClick={() => handleApproveReject(row.id, 'reject')}>Reject</Button>
        )}
        <Button size="sm" variant="destructive" onClick={() => handleSuspend(row.id)}>Suspend</Button>
      </div>
    )},
  ];

  return (
    <DashboardLayout userRole="ADMIN">
      <div className="w-full px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">Vendor Management</h1>
        <DashboardTable
          title="All Vendors"
          data={vendors}
          columns={vendorTableColumns}
          loading={loading}
          emptyMessage={error || 'No vendors found'}
        />
        {/* Pagination Controls */}
        <div className="flex justify-center mt-6 gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page <= 1}
            onClick={() => fetchVendors(pagination.page - 1)}
          >
            Previous
          </Button>
          <span className="px-3 py-2 text-sm">Page {pagination.page} of {pagination.pages}</span>
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page >= pagination.pages}
            onClick={() => fetchVendors(pagination.page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminVendorsPage;