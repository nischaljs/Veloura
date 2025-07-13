import { Eye, Heart, Star } from 'lucide-react';
import type { AllProduct } from '../types';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardDescription, CardTitle } from './ui/card';
import { addToCart } from '../services/cart';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useState } from 'react';

interface ProductsCardProps {
  products: AllProduct[];
  cardClassName?: string;
  imageClassName?: string;
  showPrice?: boolean;
  showRating?: boolean;
  showBrand?: boolean;
  showVendor?: boolean;
  showStatus?: boolean;
  buttonText?: string;
  onProductClick?: (product: AllProduct) => void;
  onAddToCart?: (product: AllProduct) => void;
  onWishlist?: (product: AllProduct) => void;
}

const ProductsCard = ({ 
  products, 
  cardClassName = '', 
  imageClassName = '', 
  showPrice = true,
  showRating = true,
  showBrand = true,
  showVendor = false,
  showStatus = false,
  buttonText = 'Add to Cart',
  onProductClick,
  onAddToCart,
  onWishlist
}: ProductsCardProps) => {
  const [cartLoading, setCartLoading] = useState<{ [key: string]: boolean }>({});
  const [cartMessage, setCartMessage] = useState<{ [key: string]: string | null }>({});

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-500';
      case 'DRAFT': return 'bg-yellow-500';
      case 'INACTIVE': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const formatPrice = (price: number, salePrice?: number | null) => {
    if (salePrice && salePrice < price) {
      return (
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg text-red-600">Rs.{salePrice}</span>
          <span className="text-sm text-gray-500 line-through">Rs.{price}</span>
          <Badge variant="destructive" className="text-xs">
            {Math.round(((price - salePrice) / price) * 100)}% OFF
          </Badge>
        </div>
      );
    }
    return <span className="font-bold text-lg">Rs.{price}</span>;
  };

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

  const { user } = useAuth();
  const navigate = useNavigate();
  const handleAddToCart = async (product: AllProduct) => {
    if (onAddToCart) return onAddToCart(product);
    if (!user) {
      toast.info('Please login to add items to your cart.');
      navigate('/login');
      return;
    }
    setCartLoading((prev) => ({ ...prev, [product.id]: true }));
    setCartMessage((prev) => ({ ...prev, [product.id]: null }));
    try {
      await addToCart({ productId: product.id, quantity: 1 });
      setCartMessage((prev) => ({ ...prev, [product.id]: 'Added to cart!' }));
    } catch (err: any) {
      setCartMessage((prev) => ({ ...prev, [product.id]: err.response?.data?.message || 'Failed to add to cart' }));
    } finally {
      setCartLoading((prev) => ({ ...prev, [product.id]: false }));
    }
  };

  return (
    <>
      {products.map((product) => (
        <Card 
          key={product.id} 
          className={`group relative rounded-3xl bg-gradient-to-br from-white via-zinc-50 to-zinc-100 shadow-xl border-0 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden p-0 ${cardClassName}`}
        >
          <div className="relative">
            {product.image?.url ? (
              <img
                src={product.image.url}
                alt={product.image?.altText || product.name}
                className={`w-full h-56 object-cover rounded-t-3xl transition-transform duration-300 group-hover:scale-105 ${imageClassName}`}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className={`w-full h-56 flex items-center justify-center bg-gray-200 rounded-t-3xl ${imageClassName}`}>
                <span className="text-gray-500 text-lg font-semibold">{product.image?.altText || product.name}</span>
              </div>
            )}
            {showStatus && (
              <Badge className="absolute top-4 left-4 bg-yellow-200 text-yellow-800 font-semibold px-3 py-1 rounded-full text-xs shadow">
                {product.status}
              </Badge>
            )}
            {product.stockQuantity === 0 && (
              <Badge className="absolute top-4 right-4 bg-gray-800 text-white shadow rounded-full px-3 py-1 text-xs">Out of Stock</Badge>
            )}
            {/* Overlay actions */}
            <div className="absolute inset-0 flex items-end justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity">
              {onWishlist && (
                <Button size="icon" variant="ghost" className="bg-white/80 hover:bg-white shadow" onClick={(e) => { e.stopPropagation(); onWishlist(product); }}>
                  <Heart className="w-5 h-5" />
                </Button>
              )}
              {onProductClick && (
                <Button size="icon" variant="ghost" className="bg-white/80 hover:bg-white shadow ml-2" onClick={(e) => { e.stopPropagation(); onProductClick(product); }}>
                  <Eye className="w-5 h-5" />
                </Button>
              )}
            </div>
          </div>
          <div className="flex-1 flex flex-col px-6 py-5 gap-3">
            <div className="flex items-center gap-2 mb-2">
              {showBrand && product.brand && (
                <Badge variant="outline" className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">{product.brand.name}</Badge>
              )}
              {showRating && renderRating(product.rating || 0, product.reviewCount || 0)}
            </div>
            <CardTitle className="text-base font-bold truncate">{product.name}</CardTitle>
            <CardDescription className="text-xs text-gray-500 line-clamp-2">{product.shortDescription || product.description}</CardDescription>
            {showVendor && product.vendor && (
              <div className="text-xs text-gray-500">Sold by <span className="font-medium">{product.vendor.businessName}</span></div>
            )}
            <div className="text-xs text-gray-400 mb-2">SKU: {product.sku}</div>
            <div className="mt-auto flex flex-col gap-3">
              {showPrice && <div className="text-base font-bold text-gray-900">{formatPrice(product.price, product.salePrice)}</div>}
              <Button 
                className="w-full h-11 bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-semibold shadow-md hover:scale-105 hover:shadow-lg transition-transform text-base"
                onClick={() => handleAddToCart(product)}
                disabled={product.stockQuantity === 0 || cartLoading[product.id]}
              >
                {product.stockQuantity === 0 ? 'Out of Stock' : (cartLoading[product.id] ? 'Adding...' : buttonText)}
              </Button>
              {cartMessage[product.id] && (
                <div className={`text-xs mt-1 ${cartMessage[product.id] === 'Added to cart!' ? 'text-green-600' : 'text-red-500'}`}>{cartMessage[product.id]}</div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </>
  );
};

export default ProductsCard;