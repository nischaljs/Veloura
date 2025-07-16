import React, { useEffect, useState } from 'react';
import { getCart } from '../services/cart';
import { createOrder } from '../services/order';
import { initiateKhaltiPayment, initiateEsewaPayment, confirmCODPayment, getPaymentOptions } from '../services/payment';
import { Card, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { useAuth } from '../context/AuthContext';

const OrderPage: React.FC = () => {
  const [cart, setCart] = useState<any>(null);
  const [address, setAddress] = useState<any>({});
  const [paymentMethod, setPaymentMethod] = useState<string>('KHALTI');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);
  const [paymentOptions, setPaymentOptions] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    getCart().then(res => setCart(res.data.data.cart));
    getPaymentOptions()
      .then(res => {
        const opts = res.data.data.paymentOptions || res.data.data.options || [];
        const fallback = [
          { method: 'KHALTI', label: 'Khalti', description: 'Pay with Khalti wallet', enabled: true },
          { method: 'ESEWA', label: 'eSewa', description: 'Pay with eSewa wallet', enabled: true },
          { method: 'CARD', label: 'Card', description: 'Pay with debit/credit card', enabled: true },
          { method: 'COD', label: 'Cash on Delivery', description: 'Pay with cash on delivery', enabled: true }
        ];
        if (opts.length > 0) {
          setPaymentOptions(opts);
          console.log('Payment options from backend:', opts);
        } else {
          setPaymentOptions(fallback);
          console.log('Payment fallback used:', fallback);
        }
      })
      .catch(() => {
        const fallback = [
          { method: 'KHALTI', label: 'Khalti', description: 'Pay with Khalti wallet', enabled: true },
          { method: 'ESEWA', label: 'eSewa', description: 'Pay with eSewa wallet', enabled: true },
          { method: 'CARD', label: 'Card', description: 'Pay with debit/credit card', enabled: true },
          { method: 'COD', label: 'Cash on Delivery', description: 'Pay with cash on delivery', enabled: true }
        ];
        setPaymentOptions(fallback);
        console.log('Payment fallback used (error):', fallback);
      });
  }, []);

  const handlePlaceOrder = async () => {
    setPlacingOrder(true);
    setOrderError(null);
    setOrderSuccess(null);
    try {
      const orderData = {
        items: cart.items.map((item: any) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity
        })),
        shippingAddress: address,
        paymentMethod,
        customerNote: ''
      };
      const res = await createOrder(orderData);
      setOrderSuccess('Order placed!');
      // Payment integration (Khalti/eSewa/COD)
      if (paymentMethod === 'KHALTI') {
        const paymentRes = await initiateKhaltiPayment(res.data.data.order.id, window.location.origin + '/orders/success', window.location.origin + '/orders/cancel');
        window.location.href = paymentRes.data.data.paymentUrl;
      } else if (paymentMethod === 'ESEWA') {
        const paymentRes = await initiateEsewaPayment(res.data.data.order.id, window.location.origin + '/orders/success', window.location.origin + '/orders/cancel');
        // eSewa returns formHtml, so render or submit it
        const form = document.createElement('div');
        form.innerHTML = paymentRes.data.data.formHtml;
        document.body.appendChild(form);
        (form.querySelector('form') as HTMLFormElement)?.submit();
      } else if (paymentMethod === 'COD') {
        await confirmCODPayment(res.data.data.order.id);
        setOrderSuccess('Order placed with Cash on Delivery!');
      }
    } catch (err: any) {
      setOrderError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto py-8 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Please login to proceed to checkout</h2>
        <Button onClick={() => window.location.href = '/login'} className="bg-pink-600 text-white hover:bg-pink-700">Login</Button>
      </div>
    );
  }

  console.log('Render: paymentOptions', paymentOptions);

  return (
    <div className="max-w-6xl mx-auto py-8 px-2 md:px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Form (2/3 width on desktop) */}
        <div className="md:col-span-2">
          <Card className="p-4 md:p-6">
            <CardTitle className="mb-4 text-2xl font-bold">Checkout</CardTitle>
            <CardContent className="p-0">
              {/* Address fields in two columns on desktop */}
              <div className="mb-4">
                <h2 className="font-semibold mb-2">Shipping Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input placeholder="Recipient Name" value={address.recipientName || ''} onChange={e => setAddress({ ...address, recipientName: e.target.value })} />
                  <Input placeholder="Phone" value={address.phone || ''} onChange={e => setAddress({ ...address, phone: e.target.value })} />
                  <Input placeholder="Street" value={address.street || ''} onChange={e => setAddress({ ...address, street: e.target.value })} />
                  <Input placeholder="City" value={address.city || ''} onChange={e => setAddress({ ...address, city: e.target.value })} />
                  <Input placeholder="State" value={address.state || ''} onChange={e => setAddress({ ...address, state: e.target.value })} />
                  <Input placeholder="Postal Code" value={address.postalCode || ''} onChange={e => setAddress({ ...address, postalCode: e.target.value })} />
                  <Input placeholder="Country" value={address.country || ''} onChange={e => setAddress({ ...address, country: e.target.value })} />
                </div>
              </div>
              {/* Shipping & Payment options side by side on desktop */}
              <div className="grid grid-cols-1 gap-6 mb-4">
                {/* Payment options */}
                <div>
                  <h2 className="font-semibold mb-2">Payment Method</h2>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    {paymentOptions.filter(opt => opt.enabled).map(opt => (
                      <div key={opt.method} className="flex items-center gap-2 mb-2">
                        <RadioGroupItem value={opt.method} />
                        <div className="flex flex-col">
                          <span className="font-medium">{opt.label}</span>
                          <span className="text-xs text-gray-500">{opt.description}</span>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
              {orderError && <div className="text-red-600 mb-2">{orderError}</div>}
              {orderSuccess && <div className="text-green-600 mb-2">{orderSuccess}</div>}
              <Button onClick={handlePlaceOrder} disabled={placingOrder} className="w-full mt-2">
                {placingOrder ? 'Placing Order...' : 'Place Order'}
              </Button>
            </CardContent>
          </Card>
        </div>
        {/* Right: Order summary (1/3 width on desktop) */}
        <div className="md:col-span-1">
          <Card className="p-4 md:p-6 sticky top-24">
            <CardTitle className="text-xl font-bold mb-2">Order Summary</CardTitle>
            <CardContent className="p-0">
              {cart && (
                <>
                  <div className="rounded-xl bg-zinc-50 border border-zinc-200 shadow-sm p-4 mb-4 max-h-48 overflow-y-auto">
                    {cart.items.map((item: any) => (
                      <div key={item.id} className="flex items-center gap-3 py-2 border-b last:border-b-0 border-zinc-100">
                        <img src={item.product.productImage || ''} alt={item.product.name} className="w-12 h-12 object-cover rounded-lg border bg-gray-100" onError={e => { e.currentTarget.style.display = 'none'; }} />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm truncate">{item.product.name}</div>
                          <div className="text-xs text-gray-500">x{item.quantity}</div>
                        </div>
                        <div className="font-bold text-base text-indigo-600">Rs.{item.product.salePrice || item.product.price}</div>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl bg-gradient-to-r from-indigo-50 to-pink-50 border border-indigo-100 shadow p-4 flex flex-col gap-2">
                    <div className="flex justify-between text-base"><span>Subtotal</span><span>Rs.{cart.summary.subtotal}</span></div>
                    <div className="flex justify-between text-base"><span>Shipping</span><span>Rs.{cart.summary.shippingFee}</span></div>
                    <div className="flex justify-between text-base"><span>Tax</span><span>Rs.{cart.summary.taxAmount}</span></div>
                    <div className="flex justify-between text-base"><span>Discount</span><span>- Rs.{cart.summary.discountAmount}</span></div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2"><span>Total</span><span className="text-pink-600">Rs.{cart.summary.total}</span></div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;