import { Eye, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { addToCart } from '../services/cart';
import type { AllProduct } from '../types';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useAuth } from '../context/AuthContext';

interface ProductsCardProps {
  product: AllProduct;
  cardClassName?: string;
  imageClassName?: string;
  showPrice?: boolean;
  showVendor?: boolean;
  showStatus?: boolean;
  buttonText?: string;
  onProductClick?: (product: AllProduct) => void;
  onAddToCart?: (product: AllProduct) => void;
}

const ProductsCard = ({ 
  product, 
  cardClassName = '', 
  imageClassName = '', 
  showPrice = true,
  showVendor = false,
  showStatus = false,
  buttonText = 'Add to Cart',
  onProductClick,
  onAddToCart,
}: ProductsCardProps) => {
  const [cartLoading, setCartLoading] = useState(false);
  const { user } = useAuth();

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
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-lg text-red-600">Rs.{salePrice}</span>
          <span className="text-sm text-gray-500 line-through">Rs.{price}</span>
          <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
            {Math.round(((price - salePrice) / price) * 100)}% OFF
          </Badge>
        </div>
      );
    }
    return <span className="font-bold text-lg">Rs.{price}</span>;
  };

  const navigate = useNavigate();
  const handleAddToCart = async (product: AllProduct) => {
    if (onAddToCart) return onAddToCart(product);
    if (!user) {
      toast.info('Please login to add items to your cart.');
      navigate('/login');
      return;
    }
    if (user.role !== 'CUSTOMER') {
      toast.error('Please login as a customer to add items to your cart.');
      navigate('/login');
      return;
    }
    setCartLoading(true);
    try {
      await addToCart({ productId: product.id, quantity: 1 });
      toast.success('Added to cart!');
    } catch (err: any) {
      const status = err?.response?.status;
      const message = err?.response?.data?.message || '';
      if (status === 401 || status === 403) {
        toast.info('Please login to add items to your cart.');
        localStorage.removeItem('token');
        navigate('/login');
      } else if (
        status === 500 &&
        message.includes('Foreign key constraint violated') &&
        message.includes('userId')
      ) {
        toast.error('Your session is invalid. Please log in again.');
        localStorage.removeItem('token');
        navigate('/login');
      } else if (status === 500) {
        toast.error('Something went wrong. Please try again.');
      } else {
        toast.error(message || 'Failed to add to cart');
      }
    } finally {
      setCartLoading(false);
    }
  };

  return (
    <Card 
      key={product.id} 
      className={`group relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col w-full bg-white border hover:-translate-y-1 ${cardClassName}`}
    >
      <CardHeader className="p-0 m-0 border-b-0">
        <div className="relative overflow-hidden bg-white p-0 m-0">
          <img
            src={product.image?.url || 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=600'}
            alt={product.image?.altText || product.name}
            className={`w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105 ${imageClassName}`}
            onClick={() => onProductClick && onProductClick(product)}
            onError={e => { (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=600'; }}
          />
          {/* Status and Stock Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {product.stockQuantity === 0 ? (
              <Badge className="bg-red-600 text-white shadow-sm rounded-md px-2 py-1 text-xs font-medium">
                Out of Stock
              </Badge>
            ) : (
              showStatus && (
                <Badge className={`${getStatusColor(product.status || '')} text-white font-medium px-2 py-1 rounded-md text-xs shadow-sm`}>
                  {product.status}
                </Badge>
              )
            )}
          </div>
          {/* Quick View Button */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button 
              size="icon" 
              variant="ghost" 
              className="bg-white/90 hover:bg-white rounded-full shadow-sm h-8 w-8" 
              onClick={(e) => { e.stopPropagation(); onProductClick && onProductClick(product); }}
            >
              <Eye className="w-4 h-4 text-gray-700" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-start justify-start gap-1 p-3 pb-2">
        {/* Product Name */}
        <CardTitle 
          className="text-base font-semibold text-gray-900 line-clamp-2 hover:text-indigo-600 transition-colors cursor-pointer mb-0 leading-tight" 
          style={{ marginTop: 0 }}
          onClick={() => onProductClick && onProductClick(product)}
        >
          {product.name}
        </CardTitle>
        {/* Vendor */}
        {showVendor && product.vendor && (
          <div className="text-xs text-gray-500 mt-0.5 mb-1">
            by <span className="font-medium text-indigo-500">{product.vendor.businessName}</span>
          </div>
        )}
        {/* Price */}
        {showPrice && (
          <div className="text-base font-bold text-indigo-700 mt-1 mb-0">
            {formatPrice(product.price, product.salePrice)}
          </div>
        )}
      </CardContent>
      <div className="w-full border-t border-gray-100 mt-0 pt-2 bg-gradient-to-t from-gray-50 to-transparent flex flex-col items-stretch">
        {(user?.role === 'CUSTOMER' || !user) && (
          <Button 
            className="w-full h-9 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-sm hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 text-sm"
            onClick={() => handleAddToCart(product)}
            disabled={product.stockQuantity === 0 || cartLoading}
          >
            {cartLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <ShoppingCart className="w-4 h-4" />
            )}
            <span>
              {product.stockQuantity === 0 ? 'Out of Stock' : (cartLoading ? 'Adding...' : buttonText)}
            </span>
          </Button>
        )}
      </div>
    </Card>
  );
};

export default ProductsCard;