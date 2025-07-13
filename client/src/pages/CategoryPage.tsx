import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCategoryBySlug, getCategoryProducts } from '../services/category';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { ShoppingBag, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';

const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [category, setCategory] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const [cartLoading, setCartLoading] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getCategoryBySlug(slug)
      .then(res => setCategory(res.data.data.category))
      .catch(() => setError('Category not found'))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    setProductsLoading(true);
    getCategoryProducts(slug, { limit: 40 })
      .then(res => setProducts(res.data.data.products || []))
      .finally(() => setProductsLoading(false));
  }, [slug]);

  if (error) {
    return <div className="max-w-3xl mx-auto py-16 text-center text-red-500 text-xl">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      {/* Category Info */}
      <Card className="mb-8 p-6 flex flex-col md:flex-row gap-6 items-center md:items-start">
        {loading ? (
          <Skeleton className="w-32 h-32 rounded-full" />
        ) : category?.image ? (
          <img src={category.image} alt={category.name} className="w-32 h-32 rounded-full object-cover border" />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center text-4xl text-gray-400">🏷️</div>
        )}
        <div className="flex-1 flex flex-col gap-2">
          <CardTitle className="text-3xl font-bold">{loading ? <Skeleton className="w-48 h-8" /> : category?.name}</CardTitle>
          <div className="text-gray-600 mb-2">{loading ? <Skeleton className="w-64 h-6" /> : category?.description}</div>
        </div>
      </Card>

      {/* Products */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Products in {category?.name || 'Category'}</h2>
        </div>
        {productsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-xl" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-gray-500 text-center py-8">No products found in this category.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <Card key={product.id} className="cursor-pointer hover:shadow-lg transition" onClick={() => navigate(`/products/${product.slug}`)}>
                <div className="w-full h-48 bg-gray-100 rounded-t-lg overflow-hidden flex items-center justify-center">
                  {product.images && product.images.length > 0 ? (
                    <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-5xl">📦</div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-gray-600 text-sm line-clamp-2 mb-2">{product.shortDescription || product.description}</div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">Rs.{product.price}</span>
                    <span className="text-xs text-gray-500">Stock: {product.stockQuantity}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Brand: {product.brand?.name || 'N/A'}</div>
                  <Button 
                    size="icon" 
                    className="bg-indigo-600 hover:bg-indigo-700 w-8 h-8 mt-2" 
                    onClick={async e => {
                      e.stopPropagation();
                      setCartLoading(prev => ({ ...prev, [product.id]: true }));
                      try {
                        await addToCart({ productId: product.id, quantity: 1 });
                        toast.success('Added to cart!');
                      } catch (err) {
                        toast.error('Failed to add to cart');
                      } finally {
                        setCartLoading(prev => ({ ...prev, [product.id]: false }));
                      }
                    }}
                    disabled={cartLoading[product.id] || product.stockQuantity === 0}
                  >
                    {cartLoading[product.id] ? (
                      <span className="w-4 h-4 animate-spin border-2 border-white border-t-transparent rounded-full block mx-auto" />
                    ) : (
                      <ShoppingBag className="w-4 h-4" />
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage; 