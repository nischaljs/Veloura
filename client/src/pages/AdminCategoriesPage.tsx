import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import DashboardTable from '../components/dashboard/DashboardTable';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/admin';
import { Category } from '../types';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { Input } from '../components/ui/input';

const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  const [newCategoryName, setNewCategoryName] = useState('');

  const fetchCategories = async (page = pagination.page) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCategories({ page, limit: pagination.limit });
      setCategories(res.data.data.categories);
      setPagination(res.data.data.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch categories');
      toast.error(err.response?.data?.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async () => {
    if (!newCategoryName) {
      toast.error('Category name is required');
      return;
    }
    try {
      await createCategory({ name: newCategoryName });
      toast.success('Category created successfully');
      setNewCategoryName('');
      fetchCategories();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create category');
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await deleteCategory(id);
      toast.success('Category deleted successfully');
      fetchCategories();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete category');
    }
  };

  const categoryTableColumns = [
    { key: 'name', label: 'Name', render: (value: any) => (
      <div className="font-medium">{value}</div>
    )},
    { key: 'productCount', label: 'Products' },
    { key: 'subcategoryCount', label: 'Subcategories' },
    { key: 'actions', label: 'Actions', render: (value: any, row: Category) => (
      <div className="flex gap-2">
        <Button size="sm" variant="destructive" onClick={() => handleDeleteCategory(row.id)}>Delete</Button>
      </div>
    )},
  ];

  return (
    <DashboardLayout userRole="ADMIN">
      <div className="w-full px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">Category Management</h1>
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="New category name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
          <Button onClick={handleCreateCategory}>Create Category</Button>
        </div>
        <DashboardTable
          title="All Categories"
          data={categories}
          columns={categoryTableColumns}
          loading={loading}
          emptyMessage={error || 'No categories found'}
        />
        {/* Pagination Controls */}
        <div className="flex justify-center mt-6 gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page <= 1}
            onClick={() => fetchCategories(pagination.page - 1)}
          >
            Previous
          </Button>
          <span className="px-3 py-2 text-sm">Page {pagination.page} of {pagination.pages}</span>
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page >= pagination.pages}
            onClick={() => fetchCategories(pagination.page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminCategoriesPage;