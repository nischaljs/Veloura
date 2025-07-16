import React, { useEffect, useState, useRef } from 'react';
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
import { Link } from 'react-router-dom';

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
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [attributes, setAttributes] = useState<{ name: string; value: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    // Fetch categories
    getAllCategories({ limit: 100 }).then(res => setCategories(res.data.data.categories || []));
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
      weight: product.weight,
      length: product.length,
      width: product.width,
      height: product.height,
    });
    setImagePreviews(product.images?.map(img => img.url) || []);
    setTags(product.tags?.map(tag => tag.name) || []);
    setAttributes(product.attributes?.map(attr => ({ name: attr.name, value: attr.value })) || []);
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(files);
    setImagePreviews(files.map(file => URL.createObjectURL(file)));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleAttributeChange = (idx: number, field: 'name' | 'value', value: string) => {
    setAttributes(attrs => attrs.map((attr, i) => i === idx ? { ...attr, [field]: value } : attr));
  };

  const handleAddAttribute = () => {
    setAttributes(attrs => [...attrs, { name: '', value: '' }]);
  };

  const handleRemoveAttribute = (idx: number) => {
    setAttributes(attrs => attrs.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let productRes;
      if (editingId) {
        productRes = await updateProduct(editingId, { ...form, tags, attributes });
        toast.success('Product updated');
      } else {
        productRes = await addProduct({ ...form, tags, attributes });
        toast.success('Product added');
      }
      const productId = editingId || productRes.data.data.product.id;
      // Upload images if any
      if (images.length > 0) {
        const formData = new FormData();
        images.forEach(img => formData.append('images', img));
        await fetch(`/api/products/${productId}/images`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          body: formData,
        });
      }
      setOpen(false);
      fetchProducts();
      setImages([]);
      setImagePreviews([]);
      setTags([]);
      setAttributes([]);
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="w-full h-48 bg-gray-200 rounded-t-lg"></div>
                    <CardHeader>
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : products.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-lg text-gray-600">No products found.</p>
                <p className="text-sm text-gray-500">Click "Add Product" to get started!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Card key={product.id} className="flex flex-col">
                    <div className="relative w-full h-48 bg-gray-100 rounded-t-lg overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0].url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-6xl">📦</div>
                      )}
                      <Badge
                        variant={product.status === 'ACTIVE' ? 'default' : 'secondary'}
                        className="absolute top-2 left-2"
                      >
                        {product.status}
                      </Badge>
                    </div>
                    <CardHeader className="flex-grow">
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {product.shortDescription || product.description}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold">Rs.{product.price}</span>
                        <span className="text-sm text-gray-500">Stock: {product.stockQuantity}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Category: {product.category ? (
                          <Link to={`/category/${product.category.slug}`} className="text-indigo-600 hover:underline">{product.category.name}</Link>
                        ) : 'N/A'}
                      </div>
                      <div className="flex gap-2 pt-4">
                        <Button size="sm" variant="outline" onClick={() => handleOpenEdit(product)} className="flex-1">
                          Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(product.id)} className="flex-1">
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
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
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block mb-1 font-medium">Category</label>
                  <select name="categoryId" value={form.categoryId} onChange={handleChange} className="w-full border rounded px-3 py-2" required>
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
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
              {/* Images */}
              <div>
                <label className="block mb-1 font-medium">Images</label>
                <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleImageChange} className="mb-2" />
                <div className="flex gap-2 flex-wrap">
                  {imagePreviews.map((src, i) => (
                    <img key={i} src={src} alt="preview" className="w-20 h-20 object-cover rounded border" />
                  ))}
                </div>
              </div>
              {/* Tags */}
              <div>
                <label className="block mb-1 font-medium">Tags</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                    className="border rounded px-2 py-1"
                    placeholder="Add tag and press Enter"
                  />
                  <Button type="button" onClick={handleAddTag} size="sm">Add</Button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {tags.map(tag => (
                    <span key={tag} className="bg-gray-200 rounded px-2 py-1 text-xs flex items-center gap-1">
                      {tag}
                      <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-1 text-red-500">&times;</button>
                    </span>
                  ))}
                </div>
              </div>
              {/* Attributes */}
              <div>
                <label className="block mb-1 font-medium">Attributes</label>
                {attributes.map((attr, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={attr.name}
                      onChange={e => handleAttributeChange(idx, 'name', e.target.value)}
                      placeholder="Name"
                      className="border rounded px-2 py-1 w-1/3"
                    />
                    <input
                      type="text"
                      value={attr.value}
                      onChange={e => handleAttributeChange(idx, 'value', e.target.value)}
                      placeholder="Value"
                      className="border rounded px-2 py-1 w-1/2"
                    />
                    <button type="button" onClick={() => handleRemoveAttribute(idx)} className="text-red-500">&times;</button>
                  </div>
                ))}
                <Button type="button" onClick={handleAddAttribute} size="sm">Add Attribute</Button>
              </div>
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