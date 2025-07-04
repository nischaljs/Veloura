import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { getProductBySlug } from '../services/product';
import { addToWishlist } from '../services/wishlist';
import { addToCart } from '../services/cart';

const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistMessage, setWishlistMessage] = useState<string | null>(null);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartMessage, setCartMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getProductBySlug(slug)
      .then((res) => setProduct(res.data.data.product))
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAddToWishlist = async () => {
    if (!product) return;
    setWishlistLoading(true);
    setWishlistMessage(null);
    try {
      await addToWishlist(product.id);
      setWishlistMessage('Added to wishlist!');
    } catch (err: any) {
      setWishlistMessage(err.response?.data?.message || 'Failed to add to wishlist');
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    setCartLoading(true);
    setCartMessage(null);
    try {
      await addToCart({ productId: product.id, quantity: 1 });
      setCartMessage('Added to cart!');
    } catch (err: any) {
      setCartMessage(err.response?.data?.message || 'Failed to add to cart');
    } finally {
      setCartLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-96">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-96 text-red-500">{error}</div>;
  if (!product) return null;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <Card className="flex flex-col md:flex-row gap-8 p-6">
        {/* Image Gallery */}
        <div className="flex flex-col gap-2 md:w-1/2">
          {product.images && product.images.length > 0 ? (
            <>
              <img
                src={product.images[0].url}
                alt={product.images[0].altText || product.name}
                className="w-full h-96 object-cover rounded-2xl bg-gray-100 mb-2"
              />
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((img: any, idx: number) => (
                  <img
                    key={img.id || idx}
                    src={img.url}
                    alt={img.altText || product.name}
                    className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                  />
                ))}
              </div>
            </>
          ) : (
            <img
              src={product.image?.url}
              alt={product.image?.altText || product.name}
              className="w-full h-96 object-cover rounded-2xl bg-gray-100"
            />
          )}
        </div>
        {/* Product Info */}
        <div className="flex-1 flex flex-col gap-4">
          <CardTitle className="text-3xl font-bold">{product.name}</CardTitle>
          <CardDescription className="text-lg text-gray-600">{product.description}</CardDescription>
          <div className="flex gap-2 items-center flex-wrap">
            {product.brand && <Badge variant="outline">Brand: {product.brand.name}</Badge>}
            {product.category && <Badge variant="outline">Category: {product.category.name}</Badge>}
            {product.status && <Badge>Status: {product.status}</Badge>}
            {product.isFeatured && <Badge variant="destructive">Featured</Badge>}
            {product.stockQuantity === 0 && <Badge variant="destructive">Out of Stock</Badge>}
          </div>
          <div className="text-2xl font-bold text-indigo-600">
            Rs.{product.salePrice && product.salePrice < product.price ? product.salePrice : product.price}
            {product.salePrice && product.salePrice < product.price && (
              <span className="ml-2 text-gray-400 line-through text-lg">Rs.{product.price}</span>
            )}
          </div>
          <div className="text-gray-500">SKU: {product.sku}</div>
          <div className="text-gray-500">Vendor: {product.vendor?.businessName}</div>
          <div className="text-gray-500">Created: {new Date(product.createdAt).toLocaleString()}</div>
          <div className="text-gray-500">Updated: {new Date(product.updatedAt).toLocaleString()}</div>
          <div className="flex gap-4 mt-4">
            <Button disabled={product.stockQuantity === 0 || cartLoading} onClick={handleAddToCart}>
              {product.stockQuantity === 0 ? 'Out of Stock' : (cartLoading ? 'Adding...' : 'Add to Cart')}
            </Button>
            <Button variant="outline" onClick={handleAddToWishlist} disabled={wishlistLoading}>
              {wishlistLoading ? 'Adding...' : 'Add to Wishlist'}
            </Button>
          </div>
          {wishlistMessage && (
            <div className="text-green-600 text-sm mt-1">{wishlistMessage}</div>
          )}
          {cartMessage && (
            <div className={`text-sm mt-1 ${cartMessage === 'Added to cart!' ? 'text-green-600' : 'text-red-500'}`}>{cartMessage}</div>
          )}
          {/* Short Description */}
          {product.shortDescription && (
            <div className="text-gray-700 mt-2">{product.shortDescription}</div>
          )}
          {/* Attributes */}
          {product.attributes && product.attributes.length > 0 && (
            <div className="mt-4">
              <div className="font-semibold mb-1">Attributes:</div>
              <ul className="list-disc list-inside text-gray-700">
                {product.attributes.map((attr: any) => (
                  <li key={attr.id || attr.name}><b>{attr.name}:</b> {attr.value}</li>
                ))}
              </ul>
            </div>
          )}
          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="mt-4">
              <div className="font-semibold mb-1">Variants:</div>
              <ul className="list-disc list-inside text-gray-700">
                {product.variants.map((variant: any) => (
                  <li key={variant.id || variant.name}>{variant.name}: {variant.value} (Stock: {variant.stockQuantity}, SKU: {variant.sku})</li>
                ))}
              </ul>
            </div>
          )}
          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="mt-4">
              <div className="font-semibold mb-1">Tags:</div>
              <div className="flex gap-2 flex-wrap">
                {product.tags.map((tag: any) => (
                  <Badge key={tag.id || tag.name} variant="secondary">{tag.name}</Badge>
                ))}
              </div>
            </div>
          )}
          {/* Reviews */}
          {product.reviews && product.reviews.length > 0 && (
            <div className="mt-4">
              <div className="font-semibold mb-1">Reviews:</div>
              <ul className="list-disc list-inside text-gray-700">
                {product.reviews.map((review: any) => (
                  <li key={review.id}>{review.content} <span className="text-xs text-gray-500">({review.rating}★)</span></li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ProductDetailPage; 