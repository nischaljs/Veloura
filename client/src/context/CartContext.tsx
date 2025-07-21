import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { getCart, addToCart, updateCartItem, removeCartItem, clearCart } from '../services/cart';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface CartItem {
  id: number;
  product: any;
  quantity: number;
}

interface CartSummary {
  itemCount: number;
  subtotal: number;
  total: number;
  [key: string]: any;
}

interface Cart {
  items: CartItem[];
  summary: CartSummary;
  [key: string]: any;
}

interface CartContextType {
  cart: Cart | null;
  cartCount: number;
  loading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addToCart: (args: { productId: number | string, variantId?: number | string, quantity?: number }) => Promise<void>;
  updateCartItem: (itemId: number, quantity: number) => Promise<void>;
  removeCartItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchCart = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCart();
      setCart(res.data.data.cart);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch cart');
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleAddToCart = async (args: { productId: number | string, variantId?: number | string, quantity?: number }) => {
    setLoading(true);
    try {
      await addToCart(args);
      await fetchCart();
      toast.success('Added to cart!', {
        icon: '🛒',
        duration: 2000,
        style: { fontWeight: 'bold', fontSize: '1.1em' }
      });
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        toast.info('Please login to add items to your cart.');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        toast.error(err.response?.data?.message || 'Failed to add to cart');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCartItem = async (itemId: number, quantity: number) => {
    setLoading(true);
    try {
      await updateCartItem(itemId, quantity);
      await fetchCart();
    } catch (err) {
      // Optionally handle error
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCartItem = async (itemId: number) => {
    setLoading(true);
    try {
      await removeCartItem(itemId);
      await fetchCart();
    } catch (err) {
      // Optionally handle error
    } finally {
      setLoading(false);
    }
  };

  const handleClearCart = async () => {
    setLoading(true);
    try {
      await clearCart();
      await fetchCart();
    } catch (err) {
      // Optionally handle error
    } finally {
      setLoading(false);
    }
  };

  const cartCount = cart?.summary?.itemCount || 0;

  return (
    <CartContext.Provider value={{ cart, cartCount, loading, error, fetchCart, addToCart: handleAddToCart, updateCartItem: handleUpdateCartItem, removeCartItem: handleRemoveCartItem, clearCart: handleClearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};