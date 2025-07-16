import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductBySlug } from '../services/product';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Star, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { addToCart } from '../services/cart';
import { Skeleton } from '../components/ui/skeleton';

const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartLoading, setCartLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getProductBySlug(slug as string);
        setProduct(res.data.data.product);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch product');
        toast.error(err.response?.data?.message || 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const handleAddToCart = async () => {
    if (!product) return;
    if (!user) {
      toast.info('Please login to add items to your cart.');
      navigate('/login');
      return;
    }
    setCartLoading(true);
    try {
      await addToCart({ productId: product.id, quantity: 1 });
      toast.success('Added to cart!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    } finally {
      setCartLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="w-full h-96 rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="container mx-auto py-8 text-red-500 text-center">{error}</div>;
  }

  if (!product) {
    return <div className="container mx-auto py-8 text-gray-500 text-center">Product not found.</div>;
  }

  const renderRating = (rating: number, reviewCount: number) => {
    if (rating === 0 && reviewCount === 0) return null;
    return (
      <div className="flex items-center gap-1 text-sm">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
            />
          ))}
        </div>
        <span className="text-gray-600">{rating > 0 ? rating.toFixed(1) : 'No rating'}</span>
        {reviewCount > 0 && <span className="text-gray-500">({reviewCount})</span>}
      </div>
    );
  };

  // Use all images for gallery
  const images: { url: string; altText?: string }[] = product.images && product.images.length > 0 ? product.images : [{ url: 'https://via.placeholder.com/400', altText: product.name }];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-pink-50 py-10 px-2">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-0 overflow-hidden flex flex-col lg:flex-row">
        {/* Product Image Gallery */}
        <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-white p-8 lg:p-12">
          <img 
            src={images[0].url}
            alt={images[0].altText || product.name}
            className="w-full max-w-md h-96 object-contain rounded-2xl shadow-lg border mb-2"
          />
          {images.length > 1 && (
            <div className="flex gap-2 mt-2">
              {images.map((img, idx) => (
                <img
                  key={img.url}
                  src={img.url}
                  alt={img.altText || product.name}
                  className="w-16 h-16 object-cover rounded border cursor-pointer hover:ring-2 hover:ring-indigo-400"
                  onClick={() => {/* Optionally implement image switching */}}
                />
              ))}
            </div>
          )}
        </div>
        {/* Product Details */}
        <div className="flex-1 flex flex-col gap-4 p-6 lg:p-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
          <div className="flex items-center gap-3 mb-2">
            {product.category && (
              <Badge variant="outline" className="bg-blue-100 text-blue-800">
                <Link to={`/category/${product.category.slug}`}>{product.category.name}</Link>
              </Badge>
            )}
            {renderRating(product.rating || 0, product.reviewCount || 0)}
            <Badge className="ml-2 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200 rounded">{product.status}</Badge>
          </div>
          <div className="text-gray-700 text-base md:text-lg leading-relaxed mb-2">
            {product.shortDescription || product.description}
          </div>
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-3xl md:text-4xl font-extrabold text-indigo-600">Rs.{product.salePrice || product.price}</span>
            {product.salePrice && product.salePrice < product.price && (
              <span className="text-lg md:text-xl text-gray-500 line-through">Rs.{product.price}</span>
            )}
            {product.salePrice && product.salePrice < product.price && (
              <Badge variant="destructive" className="text-base md:text-lg">
                {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm text-gray-600">Stock: {product.stockQuantity}</span>
            {product.vendor && (
              <span className="text-sm text-gray-600">Vendor: <Link to={`/vendors/${product.vendor.slug}`} className="text-indigo-600 hover:underline font-semibold">{product.vendor.businessName}</Link></span>
            )}
          </div>
          <Button 
            size="lg" 
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-lg py-3 rounded-xl shadow-md flex items-center gap-2 mt-2"
            onClick={handleAddToCart}
            disabled={product.stockQuantity === 0 || cartLoading}
          >
            {cartLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <ShoppingCart className="w-5 h-5" />
            )}
            {product.stockQuantity === 0 ? 'Out of Stock' : (cartLoading ? 'Adding to Cart...' : 'Add to Cart')}
          </Button>
          {/* Attributes, Tags */}
          {product.attributes && product.attributes.length > 0 && (
            <div className="mt-4">
              <h2 className="text-base font-semibold mb-1 text-gray-800">Attributes</h2>
              <ul className="flex flex-wrap gap-2">
                {product.attributes.map((attr: any) => (
                  <li key={attr.name} className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-700 border border-gray-200">{attr.name}: {attr.value}</li>
                ))}
              </ul>
            </div>
          )}
          {product.tags && product.tags.length > 0 && (
            <div className="mt-2">
              <h2 className="text-base font-semibold mb-1 text-gray-800">Tags</h2>
              <ul className="flex flex-wrap gap-2">
                {product.tags.map((tag: any) => (
                  <li key={tag.name} className="bg-indigo-50 px-2 py-1 rounded text-xs text-indigo-700 border border-indigo-100">{tag.name}</li>
                ))}
              </ul>
            </div>
          )}
          {/* Reviews */}
          {product.reviews && product.reviews.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2 text-gray-800">Reviews</h2>
              <div className="space-y-4">
                {product.reviews.map((review: any) => (
                  <div key={review.id} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-indigo-700 text-sm">{review.title}</span>
                      <span className="text-xs text-gray-500">Rating: {review.rating}</span>
                    </div>
                    <div className="text-gray-700 text-sm mb-1">{review.comment}</div>
                    {/* Review images */}
                    {review.images && Array.isArray(JSON.parse(review.images)) && JSON.parse(review.images).length > 0 && (
                      <div className="flex gap-2 mt-1">
                        {JSON.parse(review.images).map((img: string, idx: number) => (
                          <img key={img} src={img.startsWith('http') ? img : `http://localhost:5000${img}`} alt="Review" className="w-12 h-12 object-cover rounded border" />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;