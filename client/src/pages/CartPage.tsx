import React, { useEffect, useState } from 'react';
import { applyCoupon, removeCoupon } from '../services/cart';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Card, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useNavigate } from 'react-router-dom';

const CartPage: React.FC = () => {
  const { cart, loading, error, fetchCart, updateCartItem, removeCartItem, clearCart } = useCart();
  const { user } = useAuth();
  const [updating, setUpdating] = useState<{ [key: string]: boolean }>({});
  const [removing, setRemoving] = useState<{ [key: string]: boolean }>({});
  const [clearing, setClearing] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [couponStatus, setCouponStatus] = useState<string | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (itemId: number, quantity: number) => {
    setUpdating((prev) => ({ ...prev, [itemId]: true }));
    try {
      await updateCartItem(itemId, quantity);
    } catch (err) {
      // Optionally show error
    } finally {
      setUpdating((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    setRemoving((prev) => ({ ...prev, [itemId]: true }));
    try {
      await removeCartItem(itemId);
    } catch (err) {
      // Optionally show error
    } finally {
      setRemoving((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  const handleClearCart = async () => {
    setClearing(true);
    try {
      await clearCart();
    } catch (err) {
      // Optionally show error
    } finally {
      setClearing(false);
    }
  };

  const handleApplyCoupon = async () => {
    if (!coupon) return;
    setCouponLoading(true);
    setCouponStatus(null);
    try {
      const res = await applyCoupon(coupon);
      setCouponStatus(res.data.message || 'Coupon applied!');
      // Update cart summary with new discount
      await fetchCart();
    } catch (err: any) {
      setCouponStatus(err.response?.data?.message || 'Invalid or expired coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = async () => {
    setCouponLoading(true);
    setCouponStatus(null);
    try {
      const res = await removeCoupon();
      setCouponStatus(res.data.message || 'Coupon removed');
      setCoupon('');
      await fetchCart();
    } catch (err: any) {
      setCouponStatus(err.response?.data?.message || 'Failed to remove coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-96">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-96 text-red-500">{error}</div>;
  if (user && user.role !== 'CUSTOMER') return <div className="flex justify-center items-center h-96 text-gray-500">Cart is only available for customers.</div>;
  if (!cart || cart.items.length === 0) return <div className="flex flex-col items-center justify-center h-96 text-gray-500">Your cart is empty.</div>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <Card className="mb-8 p-3">
        <CardTitle className="text-2xl font-bold mb-2">Shopping Cart</CardTitle>
        <CardDescription className="mb-4">Review your items and proceed to checkout.</CardDescription>
        <CardContent>
          <div className="divide-y divide-zinc-200">
            {cart.items.map((item: any) => {
              const product = item.product;
              const imageUrl = product.productImage || '';
              const vendorLogo = product.vendorLogo || '';
              return (
                <div key={item.id} className="flex flex-col md:flex-row items-center gap-4 py-4">
                  <img src={imageUrl || '/placeholder.svg'} alt={product.name} className="w-20 h-20 object-cover rounded-lg border bg-gray-100" onError={e => { e.currentTarget.style.display = 'none'; }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-lg truncate">{product.name}</span>
                      {vendorLogo && (
                        <img src={vendorLogo} alt={product.vendor?.businessName || 'Vendor'} className="w-7 h-7 rounded-full border ml-2" />
                      )}
                      {product.vendor?.businessName && (
                        <span className="text-xs text-gray-500 ml-1">by {product.vendor.businessName}</span>
                      )}
                    </div>
                    {product.shortDescription && (
                      <div className="text-xs text-gray-600 mb-1">{product.shortDescription}</div>
                    )}
                    {item.variant && (
                      <div className="text-xs text-gray-500">Variant: {item.variant.name} - {item.variant.value}</div>
                    )}
                    <div className="text-xs text-gray-400">SKU: {product.sku}</div>
                    <div className="mt-1">
                      <Badge variant="secondary">In Stock: {product.stockQuantity}</Badge>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="font-bold text-lg">Rs.{product.salePrice ?? product.price}</div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" disabled={updating[item.id] || item.quantity <= 1} onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}>-</Button>
                      <span className="font-semibold text-base">{item.quantity}</span>
                      <Button size="sm" variant="outline" disabled={updating[item.id]} onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>+</Button>
                    </div>
                    <Button size="sm" variant="destructive" disabled={removing[item.id]} onClick={() => handleRemoveItem(item.id)}>Remove</Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      <Card className="mb-8">
        <CardTitle className="text-xl font-bold mb-2 p-3">Order Summary</CardTitle>
        <CardContent>
          <div className="mb-4 flex flex-col sm:flex-row gap-2 items-start sm:items-end">
            <input
              type="text"
              value={coupon}
              onChange={e => setCoupon(e.target.value)}
              placeholder="Enter coupon code"
              className="border rounded px-3 py-2 text-base w-full sm:w-60"
              disabled={couponLoading}
            />
            <Button onClick={handleApplyCoupon} disabled={couponLoading || !coupon} className="w-full sm:w-auto">Apply</Button>
            <Button onClick={handleRemoveCoupon} disabled={couponLoading || !cart.summary.discountAmount} variant="outline" className="w-full sm:w-auto">Remove</Button>
          </div>
          {couponStatus && (
            <div className={`mb-2 text-sm ${couponStatus.toLowerCase().includes('applied') ? 'text-green-600' : 'text-red-500'}`}>{couponStatus}</div>
          )}
          <div className="flex flex-col gap-2 text-base">
            <div className="flex justify-between"><span>Subtotal</span><span>Rs.{cart.summary?.subtotal ?? 0}</span></div>
            <div className="flex justify-between"><span>Shipping Fee</span><span>Rs.{cart.summary?.shippingFee ?? 0}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>Rs.{cart.summary?.taxAmount ?? 0}</span></div>
            <div className="flex justify-between"><span>Discount</span><span>- Rs.{cart.summary?.discountAmount ?? 0}</span></div>
            <div className="flex justify-between font-bold text-lg"><span>Total</span><span>Rs.{cart.summary?.total ?? 0}</span></div>
            <div className="flex justify-between"><span>Items</span><span>{cart.summary?.itemCount ?? 0}</span></div>
          </div>
          <Button className="w-full mt-6 bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-semibold shadow-md hover:scale-105 hover:shadow-lg transition-transform text-base" onClick={() => navigate('/checkout')}>Proceed to Checkout</Button>
          <Button className="w-full mt-2" variant="outline" onClick={handleClearCart} disabled={clearing}>Clear Cart</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CartPage; 