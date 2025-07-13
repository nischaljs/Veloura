import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import DashboardTable from '../components/dashboard/DashboardTable';
import { getBrands, createBrand, deleteBrand, uploadBrandLogo, removeBrandLogo } from '../services/admin';
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleUploadLogo = async (brandId: number) => {
    if (!selectedFile) {
      toast.error('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('logo', selectedFile);

    try {
      await uploadBrandLogo(brandId, formData);
      toast.success('Brand logo uploaded successfully!');
      setSelectedFile(null);
      fetchBrands(); // Refresh brands to show new logo
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to upload logo.');
    }
  };

  const handleRemoveLogo = async (brandId: number) => {
    if (!window.confirm('Are you sure you want to remove this logo?')) return;
    try {
      await removeBrandLogo(brandId);
      toast.success('Brand logo removed successfully!');
      fetchBrands(); // Refresh brands to show no logo
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to remove logo.');
    }
  };

  const brandTableColumns = [
    { key: 'name', label: 'Name', render: (value: any) => (
      <div className="font-medium">{value}</div>
    )},
    { key: 'logo', label: 'Logo', render: (value: any, row: Brand) => (
      <div className="flex items-center gap-2">
        {row.logo ? (
          <img src={row.logo} alt={row.name} className="w-10 h-10 object-cover rounded-full" />
        ) : (
          <span className="text-gray-500">No Logo</span>
        )}
        <Input type="file" onChange={handleFileChange} className="w-auto" />
        {selectedFile && (
          <Button size="sm" onClick={() => handleUploadLogo(row.id)}>Upload</Button>
        )}
        {row.logo && (
          <Button size="sm" variant="outline" onClick={() => handleRemoveLogo(row.id)}>Remove</Button>
        )}
      </div>
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