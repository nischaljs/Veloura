import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { getOrder, getVendorOrderDetail } from '../services/order';
import { Order } from '../types/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { Badge } from '../components/ui/badge';

const VendorOrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const res = await getVendorOrderDetail(id);
        setOrder(res.data.data.order);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch order details');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout userRole="VENDOR">
        <div className="max-w-5xl mx-auto py-8">
          <h1 className="text-3xl font-bold mb-6">Loading Order Details...</h1>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout userRole="VENDOR">
        <div className="max-w-5xl mx-auto py-8">
          <h1 className="text-3xl font-bold mb-6">Error: {error}</h1>
        </div>
      </DashboardLayout>
    );
  }

  if (!order) {
    return (
      <DashboardLayout userRole="VENDOR">
        <div className="max-w-5xl mx-auto py-8">
          <h1 className="text-3xl font-bold mb-6">Order Not Found</h1>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="VENDOR">
      <div className="max-w-5xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Order Details: {order.orderNumber}</h1>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><strong>Order Number:</strong> {order.orderNumber}</p>
                <p><strong>Status:</strong> <Badge variant={
                  order.status === 'COMPLETED' ? 'default' :
                  order.status === 'PENDING' ? 'secondary' :
                  order.status === 'CANCELLED' ? 'destructive' : 'outline'
                }>{order.status}</Badge></p>
                <p><strong>Total:</strong> Rs.{order.total?.toLocaleString()}</p>
                <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <p><strong>Customer:</strong> {order.user ? `${order.user.firstName} ${order.user.lastName}` : 'N/A'}</p>
                <p><strong>Email:</strong> {order.user?.email || 'N/A'}</p>
                {/* Add more customer details if available in order.user */}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            {order.items && order.items.length > 0 ? (
              <div className="space-y-4">
                {order.items.map(item => (
                  <div key={item.id} className="flex items-center space-x-4">
                    {/* <img src={item.product?.images?.[0]} alt={item.product?.name} className="w-16 h-16 object-cover rounded" /> */}
                    <div>
                      <p className="font-semibold">{item.product?.name || 'N/A'}</p>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      <p className="text-sm text-gray-500">Price: Rs.{item.price?.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No items found for this order.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default VendorOrderDetailPage;