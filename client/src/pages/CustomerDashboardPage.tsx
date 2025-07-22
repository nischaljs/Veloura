
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOrders } from "@/services/order";
import { DollarSign, ShoppingBag, User } from "lucide-react";
import Shimmer from "@/components/ui/Shimmer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const CustomerDashboardPage = () => {
  const [analytics, setAnalytics] = useState({
    totalOrders: 0,
    totalSpent: 0,
    // Add more relevant customer metrics here if available from API
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getOrders({ page: 1, limit: 100 });
        const orders = response.data.data.orders || [];
        setOrders(orders);
        const totalOrders = orders.length;
        const totalSpent = orders.reduce((sum: number, order: any) => {
          // order.total may be string, so parseFloat
          return sum + parseFloat(order.total || 0);
        }, 0);
        setAnalytics({ totalOrders, totalSpent });
      } catch (error) {
        console.error("Failed to fetch customer orders for dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="space-y-6 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800">Customer Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-6 w-6 text-gray-500" />
          </CardHeader>
          <CardContent>
            {loading ? <Shimmer /> : <div className="text-4xl font-bold text-indigo-600">{analytics.totalOrders}</div>}
            <p className="text-xs text-gray-500">Orders placed</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-6 w-6 text-gray-500" />
          </CardHeader>
          <CardContent>
            {loading ? <Shimmer /> : <div className="text-4xl font-bold text-green-600">Rs.{analytics.totalSpent.toFixed(2)}</div>}
            <p className="text-xs text-gray-500">Money spent on purchases</p>
          </CardContent>
        </Card>

        {/* Example of another card, if more data becomes available */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Status</CardTitle>
            <User className="h-6 w-6 text-gray-500" />
          </CardHeader>
          <CardContent>
            {loading ? <Shimmer /> : <div className="text-2xl font-bold text-purple-600">Complete</div>}
            <p className="text-xs text-gray-500">Your profile information</p>
          </CardContent>
        </Card>
      </div>

      {/* You can add more sections here, e.g., recent orders, recommended products */}
      <div className="grid grid-cols-1 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? <Shimmer /> : (
              orders.length === 0 ? (
                <p className="text-gray-500">No recent orders.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr>
                        <th className="text-left py-1 px-2">Order #</th>
                        <th className="text-left py-1 px-2">Date</th>
                        <th className="text-left py-1 px-2">Total</th>
                        <th className="text-left py-1 px-2">Status</th>
                        <th className="text-left py-1 px-2">Payment Method</th>
                        <th className="text-left py-1 px-2">Payment Status</th>
                        <th className="text-left py-1 px-2"># Products</th>
                        <th className="text-left py-1 px-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id} className="border-b">
                          <td className="py-1 px-2 font-mono">{order.orderNumber}</td>
                          <td className="py-1 px-2">{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td className="py-1 px-2">Rs.{order.total}</td>
                          <td className="py-1 px-2">{order.status}</td>
                          <td className="py-1 px-2">{order.paymentMethod}</td>
                          <td className="py-1 px-2">{order.paymentStatus}</td>
                          <td className="py-1 px-2">{order.items ? order.items.length : 0}</td>
                          <td className="py-1 px-2">
                            <button
                              className="text-blue-600 underline hover:text-blue-800"
                              onClick={() => { setSelectedOrder(order); setModalOpen(true); }}
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}
            {/* Order Details Modal */}
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Order Details</DialogTitle>
                  <DialogDescription>
                    {selectedOrder && (
                      <div className="space-y-2">
                        <div><b>Order #:</b> {selectedOrder.orderNumber}</div>
                        <div><b>Date:</b> {new Date(selectedOrder.createdAt).toLocaleDateString()}</div>
                        <div><b>Status:</b> {selectedOrder.status}</div>
                        <div><b>Total:</b> Rs.{selectedOrder.total}</div>
                        <div><b>Payment Method:</b> {selectedOrder.paymentMethod}</div>
                        <div><b>Payment Status:</b> {selectedOrder.paymentStatus}</div>
                        <div><b>Shipping Address:</b>
                          <div className="ml-2 text-xs">
                            {selectedOrder.shippingAddress.recipientName}, {selectedOrder.shippingAddress.street},<br/>
                            {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}, {selectedOrder.shippingAddress.country} - {selectedOrder.shippingAddress.postalCode}<br/>
                            Phone: {selectedOrder.shippingAddress.phone}
                          </div>
                        </div>
                        <div><b>Products:</b>
                          <ul className="ml-4 list-disc">
                            {selectedOrder.items && selectedOrder.items.map((item) => (
                              <li key={item.id}>
                                {item.productSnapshot?.name || 'Product'} (x{item.quantity}) - Rs.{item.price}
                                <span className="ml-2 text-xs text-gray-500">SKU: {item.productSnapshot?.sku}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerDashboardPage;
