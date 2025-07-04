import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getOrder } from '../services/order';
import { Card, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const OrderSuccessPage = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderId = query.get('purchase_order_id');
  const status = query.get('status');
  const txnId = query.get('transaction_id') || query.get('txnId') || query.get('tidx');
  const amount = query.get('amount') || query.get('total_amount');

  useEffect(() => {
    if (!orderId) {
      setError('No order ID found.');
      setLoading(false);
      return;
    }
    getOrder(orderId)
      .then(res => setOrder(res.data.data.order))
      .catch(() => setError('Failed to fetch order details.'))
      .finally(() => setLoading(false));
  }, [orderId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="flex justify-center items-center h-96">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-96 text-red-500">{error}</div>;
  if (!order) return <div className="flex justify-center items-center h-96 text-gray-500">Order not found.</div>;

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <Card className="mb-8 p-6 print:p-2">
        <CardTitle className="text-2xl font-bold mb-2 text-green-600">Payment Successful!</CardTitle>
        <div className="mb-2 text-gray-700">Thank you for your purchase. Your payment was successful.</div>
        <div className="mb-4 text-sm text-gray-500">Order ID: <span className="font-mono">{orderId}</span></div>
        <div className="mb-4 text-sm text-gray-500">Transaction ID: <span className="font-mono">{txnId}</span></div>
        <div className="mb-4 text-sm text-gray-500">Status: <span className="font-mono">{status}</span></div>
        <div className="mb-4 text-sm text-gray-500">Amount: <span className="font-mono">Rs.{amount}</span></div>
        <CardContent className="p-0 mt-4">
          <div className="font-semibold text-lg mb-2">Order Summary</div>
          <div className="rounded-xl bg-zinc-50 border border-zinc-200 shadow-sm p-4 mb-4">
            {order.items.map((item: any) => {
              const product = item.product || {};
              return (
                <div key={item.id} className="flex items-center gap-4 py-2 border-b last:border-b-0 border-zinc-100">
                  <img src={product.productImage || ''} alt={product.name || 'Product'} className="w-12 h-12 object-cover rounded-lg border bg-gray-100" onError={e => { e.currentTarget.style.display = 'none'; }} />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-base truncate">{product.name || 'Product'}</div>
                    <div className="text-xs text-gray-500">x{item.quantity}</div>
                  </div>
                  <div className="font-bold text-base text-indigo-600">Rs.{product.salePrice || product.price || item.price || 0}</div>
                </div>
              );
            })}
          </div>
          <div className="rounded-xl bg-gradient-to-r from-indigo-50 to-pink-50 border border-indigo-100 shadow p-4 flex flex-col gap-2">
            {order.summary ? (
              <>
                <div className="flex justify-between text-base"><span>Subtotal</span><span>Rs.{order.summary.subtotal}</span></div>
                <div className="flex justify-between text-base"><span>Shipping</span><span>Rs.{order.summary.shippingFee}</span></div>
                <div className="flex justify-between text-base"><span>Tax</span><span>Rs.{order.summary.taxAmount}</span></div>
                <div className="flex justify-between text-base"><span>Discount</span><span>- Rs.{order.summary.discountAmount}</span></div>
                <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2"><span>Total</span><span className="text-pink-600">Rs.{order.summary.total}</span></div>
              </>
            ) : (
              <div className="text-red-500">Order summary not available.</div>
            )}
          </div>
        </CardContent>
        <div className="flex gap-4 mt-6">
          <Button onClick={handlePrint} className="bg-indigo-600 text-white hover:bg-indigo-700">Print Bill</Button>
          <Button variant="outline" onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </Card>
    </div>
  );
};

export default OrderSuccessPage; 