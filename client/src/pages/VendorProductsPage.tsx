import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';
import { getMyProducts, addProduct, updateProduct, deleteProduct } from '../services/vendor';
import { Product } from '../types/product';
import { getAllCategories } from '../services/category';
import { getAllBrands } from '../services/brand';

const emptyForm = {
  name: '',
  description: '',
  shortDescription: '',
  price: '',
  salePrice: '',
  costPrice: '',
  sku: '',
  stockQuantity: '',
  status: 'ACTIVE',
  isFeatured: false,
  hasVariants: false,
  categoryId: '',
  brandId: '',
  weight: '',
  length: '',
  width: '',
  height: '',
  images: [],
  // tags, attributes, variants will be handled separately
};

const VendorProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<any>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getMyProducts();
      setProducts(res.data.data.products || []);
    } catch (err: any) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // Fetch categories and brands
    getAllCategories({ limit: 100 }).then(res => setCategories(res.data.data.categories || []));
    getAllBrands({ limit: 100 }).then(res => setBrands(res.data.data.brands || []));
  }, []);

  const handleOpenAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setForm({
      name: product.name,
      description: product.description || '',
      shortDescription: product.shortDescription || '',
      price: product.price,
      salePrice: product.salePrice,
      costPrice: product.costPrice,
      sku: product.sku,
      stockQuantity: product.stockQuantity,
      status: product.status,
      isFeatured: product.isFeatured,
      hasVariants: product.hasVariants,
      categoryId: product.categoryId,
      brandId: product.brandId,
      weight: product.weight,
      length: product.length,
      width: product.width,
      height: product.height,
      images: product.images,
      // Add more fields as needed
    });
    setEditingId(product.id);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await deleteProduct(id);
      toast.success('Product deleted');
      fetchProducts();
    } catch {
      toast.error('Failed to delete product');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await updateProduct(editingId, form);
        toast.success('Product updated');
      } else {
        await addProduct(form);
        toast.success('Product added');
      }
      setOpen(false);
      fetchProducts();
    } catch {
      toast.error('Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout userRole="VENDOR">
      <div className="max-w-6xl mx-auto py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Manage Products</h1>
          <Button onClick={handleOpenAdd}>Add Product</Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div>Loading...</div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : products.length === 0 ? (
              <div>No products found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 px-4 text-left">Name</th>
                      <th className="py-2 px-4 text-left">Price</th>
                      <th className="py-2 px-4 text-left">Stock</th>
                      <th className="py-2 px-4 text-left">Status</th>
                      <th className="py-2 px-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4 font-medium">{product.name}</td>
                        <td className="py-2 px-4">Rs.{product.price}</td>
                        <td className="py-2 px-4">{product.stockQuantity}</td>
                        <td className="py-2 px-4">
                          <Badge variant={product.status === 'ACTIVE' ? 'default' : 'secondary'}>
                            {product.status}
                          </Badge>
                        </td>
                        <td className="py-2 px-4 flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleOpenEdit(product)}>
                            Edit
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(product.id)}>
                            Delete
                          </Button>
                          {/* Placeholder for variant management */}
                          <Button size="sm" variant="secondary" disabled>
                            Variants
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
        {/* Add/Edit Product Dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Product' : 'Add Product'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Name</label>
                <Input name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div>
                <label className="block mb-1 font-medium">Description</label>
                <Textarea name="description" value={form.description} onChange={handleChange} rows={3} />
              </div>
              <div>
                <label className="block mb-1 font-medium">Short Description</label>
                <Textarea name="shortDescription" value={form.shortDescription} onChange={handleChange} rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-medium">Category</label>
                  <select name="categoryId" value={form.categoryId} onChange={handleChange} className="w-full border rounded px-3 py-2" required>
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-medium">Brand</label>
                  <select name="brandId" value={form.brandId} onChange={handleChange} className="w-full border rounded px-3 py-2">
                    <option value="">Select brand</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>{brand.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-medium">Price</label>
                  <Input name="price" type="number" value={form.price} onChange={handleChange} required />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Sale Price</label>
                  <Input name="salePrice" type="number" value={form.salePrice} onChange={handleChange} />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Cost Price</label>
                  <Input name="costPrice" type="number" value={form.costPrice} onChange={handleChange} />
                </div>
                <div>
                  <label className="block mb-1 font-medium">SKU</label>
                  <Input name="sku" value={form.sku} onChange={handleChange} required />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Stock Quantity</label>
                  <Input name="stockQuantity" type="number" value={form.stockQuantity} onChange={handleChange} required />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Status</label>
                  <select name="status" value={form.status} onChange={handleChange} className="w-full border rounded px-3 py-2">
                    <option value="ACTIVE">Active</option>
                    <option value="DRAFT">Draft</option>
                    <option value="ARCHIVED">Archived</option>
                    <option value="OUT_OF_STOCK">Out of Stock</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))} />
                  <label className="font-medium">Featured</label>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <input type="checkbox" name="hasVariants" checked={form.hasVariants} onChange={e => setForm(f => ({ ...f, hasVariants: e.target.checked }))} />
                  <label className="font-medium">Has Variants</label>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-medium">Weight (kg)</label>
                  <Input name="weight" type="number" value={form.weight} onChange={handleChange} />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Length (cm)</label>
                  <Input name="length" type="number" value={form.length} onChange={handleChange} />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Width (cm)</label>
                  <Input name="width" type="number" value={form.width} onChange={handleChange} />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Height (cm)</label>
                  <Input name="height" type="number" value={form.height} onChange={handleChange} />
                </div>
              </div>
              {/* Image upload UI (multiple, with primary selection) */}
              <div>
                <label className="block mb-1 font-medium">Images</label>
                {/* TODO: Implement image upload and preview UI here */}
                <div className="border rounded p-2 bg-gray-50 text-gray-500">Image upload coming soon</div>
              </div>
              {/* Tags, Attributes, Variants management UI placeholders */}
              <div>
                <label className="block mb-1 font-medium">Tags</label>
                <div className="border rounded p-2 bg-gray-50 text-gray-500">Tags management coming soon</div>
              </div>
              <div>
                <label className="block mb-1 font-medium">Attributes</label>
                <div className="border rounded p-2 bg-gray-50 text-gray-500">Attributes management coming soon</div>
              </div>
              {form.hasVariants && (
                <div>
                  <label className="block mb-1 font-medium">Variants</label>
                  <div className="border rounded p-2 bg-gray-50 text-gray-500">Variants management coming soon</div>
                </div>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={saving}>Cancel</Button>
                <Button type="submit" disabled={saving}>{saving ? 'Saving...' : (editingId ? 'Save Changes' : 'Add Product')}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default VendorProductsPage; 