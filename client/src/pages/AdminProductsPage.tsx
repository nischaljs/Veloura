import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import DashboardTable from '../components/dashboard/DashboardTable';
import { getProducts, updateProductStatus, deleteProduct } from '../services/admin';
import { Product } from '../types';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });

  const fetchProducts = async (page = pagination.page) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getProducts({ page, limit: pagination.limit });
      setProducts(res.data.data.products);
      setPagination(res.data.data.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch products');
      toast.error(err.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await updateProductStatus(id, status);
      toast.success('Product status updated successfully');
      fetchProducts();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update product status');
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id);
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete product');
    }
  };

  const productTableColumns = [
    { key: 'name', label: 'Product Name', render: (value: any, row: Product) => (
      <div className="font-medium">{value}</div>
    )},
    { key: 'vendor', label: 'Vendor', render: (value: any, row: Product) => (
      <div className="text-sm text-muted-foreground">{row.vendorId}</div> // Assuming vendorId is enough for now
    )},
    { key: 'price', label: 'Price', render: (value: any) => (
      <span>Rs.{value?.toLocaleString()}</span>
    )},
    { key: 'stockQuantity', label: 'Stock', render: (value: any) => (
      <Badge variant={value > 0 ? 'default' : 'destructive'}>
        {value > 0 ? value : 'Out of Stock'}
      </Badge>
    )},
    { key: 'status', label: 'Status', render: (value: any, row: Product) => (
      <Select value={value} onValueChange={(newStatus) => handleStatusChange(row.id, newStatus)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ACTIVE">ACTIVE</SelectItem>
          <SelectItem value="DRAFT">DRAFT</SelectItem>
          <SelectItem value="ARCHIVED">ARCHIVED</SelectItem>
          <SelectItem value="OUT_OF_STOCK">OUT_OF_STOCK</SelectItem>
        </SelectContent>
      </Select>
    )},
    { key: 'actions', label: 'Actions', render: (value: any, row: Product) => (
      <div className="flex gap-2">
        <Button size="sm" variant="destructive" onClick={() => handleDeleteProduct(row.id)}>Delete</Button>
      </div>
    )},
  ];

  return (
    <DashboardLayout userRole="ADMIN">
      <div className="w-full px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">Product Management</h1>
        <DashboardTable
          title="All Products"
          data={products}
          columns={productTableColumns}
          loading={loading}
          emptyMessage={error || 'No products found'}
        />
        {/* Pagination Controls */}
        <div className="flex justify-center mt-6 gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page <= 1}
            onClick={() => fetchProducts(pagination.page - 1)}
          >
            Previous
          </Button>
          <span className="px-3 py-2 text-sm">Page {pagination.page} of {pagination.pages}</span>
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page >= pagination.pages}
            onClick={() => fetchProducts(pagination.page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminProductsPage;