import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { addProduct } from "@/services/vendor";
import { getAllCategories } from "@/services/category";

const VendorAddProductPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    shortDescription: "",
    price: "",
    stockQuantity: "",
    categoryId: "",
    sku: "",
    images: [],
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await getAllCategories();
        setCategories(res.data.data.categories || []);
      } catch {
        setCategories([]);
      }
    }
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images") {
      setForm((prev) => ({ ...prev, images: files }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, images: [...prev.images, file] }));
      setImagePreviews((prev) => [...prev, URL.createObjectURL(file)]);
    }
  };

  const handleRemoveImage = (idx) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("shortDescription", form.shortDescription);
      formData.append("price", form.price);
      formData.append("stockQuantity", form.stockQuantity);
      formData.append("categoryId", form.categoryId);
      formData.append("sku", form.sku);
      for (let i = 0; i < form.images.length; i++) {
        formData.append("images", form.images[i]);
      }
      await addProduct(formData);
      navigate("/vendor/products");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="shortDescription">Short Description</Label>
              <Input id="shortDescription" name="shortDescription" value={form.shortDescription} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" value={form.description} onChange={handleChange} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price (Rs.)</Label>
                <Input id="price" name="price" type="number" min="0" value={form.price} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="stockQuantity">Stock Quantity</Label>
                <Input id="stockQuantity" name="stockQuantity" type="number" min="0" value={form.stockQuantity} onChange={handleChange} required />
              </div>
            </div>
            <div>
              <Label htmlFor="sku">SKU</Label>
              <Input id="sku" name="sku" value={form.sku} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="categoryId">Category</Label>
              <select
                id="categoryId"
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Product Images</Label>
              <div className="flex flex-col gap-2">
                {imagePreviews.map((src, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <img src={src} alt={`Preview ${idx + 1}`} className="w-20 h-20 object-cover rounded border" />
                    <Button type="button" variant="destructive" size="sm" onClick={() => handleRemoveImage(idx)}>
                      Remove
                    </Button>
                  </div>
                ))}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleAddImage}
                  key={form.images.length} // force re-render to allow same file selection
                />
              </div>
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Adding..." : "Add Product"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorAddProductPage; 