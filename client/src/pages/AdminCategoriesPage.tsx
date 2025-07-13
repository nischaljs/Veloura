import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import DashboardTable from '../components/dashboard/DashboardTable';
import { getCategories, createCategory, updateCategory, deleteCategory, uploadCategoryImage, removeCategoryImage } from '../services/admin';
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleUploadImage = async (categoryId: number) => {
    if (!selectedFile) {
      toast.error('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      await uploadCategoryImage(categoryId, formData);
      toast.success('Category image uploaded successfully!');
      setSelectedFile(null);
      fetchCategories(); // Refresh categories to show new image
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to upload image.');
    }
  };

  const handleRemoveImage = async (categoryId: number) => {
    if (!window.confirm('Are you sure you want to remove this image?')) return;
    try {
      await removeCategoryImage(categoryId);
      toast.success('Category image removed successfully!');
      fetchCategories(); // Refresh categories to show no image
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to remove image.');
    }
  };

  const categoryTableColumns = [
    { key: 'name', label: 'Name', render: (value: any) => (
      <div className="font-medium">{value}</div>
    )},
    { key: 'imageUrl', label: 'Image', render: (value: any, row: Category) => (
      <div className="flex items-center gap-2">
        {row.image ? (
          <img src={row.image} alt={row.name} className="w-10 h-10 object-cover rounded-full" />
        ) : (
          <span className="text-gray-500">No Image</span>
        )}
        <Input type="file" onChange={handleFileChange} className="w-auto" />
        {selectedFile && (
          <Button size="sm" onClick={() => handleUploadImage(row.id)}>Upload</Button>
        )}
        {row.image && (
          <Button size="sm" variant="outline" onClick={() => handleRemoveImage(row.id)}>Remove</Button>
        )}
      </div>
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