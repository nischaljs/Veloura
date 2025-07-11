import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import DashboardTable from '../components/dashboard/DashboardTable';
import { getBrands, createBrand, deleteBrand } from '../services/admin';
import { Brand } from '../types';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { Input } from '../components/ui/input';

const AdminBrandsPage: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  const [newBrandName, setNewBrandName] = useState('');

  const fetchBrands = async (page = pagination.page) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getBrands({ page, limit: pagination.limit });
      setBrands(res.data.data.brands);
      setPagination(res.data.data.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch brands');
      toast.error(err.response?.data?.message || 'Failed to fetch brands');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleCreateBrand = async () => {
    if (!newBrandName) {
      toast.error('Brand name is required');
      return;
    }
    try {
      await createBrand({ name: newBrandName });
      toast.success('Brand created successfully');
      setNewBrandName('');
      fetchBrands();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create brand');
    }
  };

  const handleDeleteBrand = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this brand?')) return;
    try {
      await deleteBrand(id);
      toast.success('Brand deleted successfully');
      fetchBrands();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete brand');
    }
  };

  const brandTableColumns = [
    { key: 'name', label: 'Name', render: (value: any) => (
      <div className="font-medium">{value}</div>
    )},
    { key: 'productCount', label: 'Products' },
    { key: 'actions', label: 'Actions', render: (value: any, row: Brand) => (
      <div className="flex gap-2">
        <Button size="sm" variant="destructive" onClick={() => handleDeleteBrand(row.id)}>Delete</Button>
      </div>
    )},
  ];

  return (
    <DashboardLayout userRole="ADMIN">
      <div className="w-full px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">Brand Management</h1>
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="New brand name"
            value={newBrandName}
            onChange={(e) => setNewBrandName(e.target.value)}
          />
          <Button onClick={handleCreateBrand}>Create Brand</Button>
        </div>
        <DashboardTable
          title="All Brands"
          data={brands}
          columns={brandTableColumns}
          loading={loading}
          emptyMessage={error || 'No brands found'}
        />
        {/* Pagination Controls */}
        <div className="flex justify-center mt-6 gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page <= 1}
            onClick={() => fetchBrands(pagination.page - 1)}
          >
            Previous
          </Button>
          <span className="px-3 py-2 text-sm">Page {pagination.page} of {pagination.pages}</span>
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page >= pagination.pages}
            onClick={() => fetchBrands(pagination.page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminBrandsPage;