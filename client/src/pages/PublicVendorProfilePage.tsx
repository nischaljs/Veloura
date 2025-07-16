import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPublicVendorProfile, getVendorProducts, getVendorReviews } from '../services/vendor';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { Star, User } from 'lucide-react';

const PublicVendorProfilePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getPublicVendorProfile(slug)
      .then(res => setVendor(res.data.data.vendor))
      .catch(() => setError('Vendor not found'))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    setProductsLoading(true);
    getVendorProducts(slug, { limit: 12 })
      .then(res => setProducts(res.data.data.products || []))
      .finally(() => setProductsLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    setReviewsLoading(true);
    getVendorReviews(slug, { limit: 5 })
      .then(res => setReviews(res.data.data.reviews || []))
      .finally(() => setReviewsLoading(false));
  }, [slug]);

  if (error) {
    return <div className="max-w-3xl mx-auto py-16 text-center text-red-500 text-xl">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      {/* Vendor Info */}
      <Card className="mb-8 p-6 flex flex-col md:flex-row gap-6 items-center md:items-start">
        {loading ? (
          <Skeleton className="w-32 h-32 rounded-full" />
        ) : vendor?.logo ? (
          <img src={vendor.logo} alt={vendor.businessName} className="w-32 h-32 rounded-full object-cover border" />
        ) : (
          <User className="w-32 h-32 text-gray-400 bg-gray-100 rounded-full p-6" />
        )}
        <div className="flex-1 flex flex-col gap-2">
          <CardTitle className="text-3xl font-bold">{loading ? <Skeleton className="w-48 h-8" /> : vendor?.businessName}</CardTitle>
          <div className="text-gray-600 mb-2">{loading ? <Skeleton className="w-64 h-6" /> : vendor?.description}</div>
          <div className="flex gap-3 flex-wrap items-center mb-2">
            {vendor?.website && <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Website</a>}
            {vendor?.facebook && <a href={vendor.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Facebook</a>}
            {vendor?.instagram && <a href={vendor.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-500 underline">Instagram</a>}
            {vendor?.twitter && <a href={vendor.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Twitter</a>}
          </div>
          <div className="flex gap-4 flex-wrap">
            {vendor?.businessEmail && <Badge variant="outline">Email: {vendor.businessEmail}</Badge>}
            {vendor?.businessPhone && <Badge variant="outline">Phone: {vendor.businessPhone}</Badge>}
          </div>
        </div>
      </Card>

      {/* Products */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Products by {vendor?.businessName || 'Vendor'}</h2>
          {products.length > 0 && (
            <Button variant="outline" onClick={() => navigate(`/products?vendor=${slug}`)}>View All</Button>
          )}
        </div>
        {productsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-xl" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-gray-500 text-center py-8">No products found for this vendor.</div>
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
                  <div className="text-xs text-gray-500 mt-1">
                    Category: {product.category ? (
                      <Link to={`/category/${product.category.slug}`} className="text-indigo-600 hover:underline">{product.category.name}</Link>
                    ) : 'N/A'}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Reviews */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Recent Reviews</h2>
        {reviewsLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-lg" />)}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-gray-500 text-center py-8">No reviews yet for this vendor.</div>
        ) : (
          <div className="space-y-4">
            {reviews.map(review => (
              <Card key={review.id} className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="font-semibold text-indigo-700 text-base">{review.user?.firstName} {review.user?.lastName}</div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: review.rating }).map((_, i) => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
                    {Array.from({ length: 5 - review.rating }).map((_, i) => <Star key={i} className="h-4 w-4 text-gray-300" />)}
                  </div>
                  <span className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="text-gray-700 text-sm">{review.comment}</div>
                {review.product && (
                  <div className="text-xs text-gray-500 mt-2">Product: <span className="font-semibold">{review.product.name}</span></div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicVendorProfilePage;