import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getVendorOrders, updateVendorOrderStatus } from "@/services/order";
import type { Order } from "@/types";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const ORDER_STATUSES = ["PENDING", "PROCESSING", "DELIVERED", "CANCELLED"];

const VendorOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  const [updating, setUpdating] = useState<number | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user || user.role !== 'VENDOR') return;
    fetchOrders(pagination.page);
    // eslint-disable-next-line
  }, [user]);

  const fetchOrders = async (page = 1) => {
    try {
      const res = await getVendorOrders({ page, limit: pagination.limit });
      setOrders(res.data.data.orders);
      setPagination(res.data.data.pagination);
    } catch (err: any) {
      // Optionally show error
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    setUpdating(orderId);
    try {
      await updateVendorOrderStatus(orderId, newStatus);
      await fetchOrders(pagination.page);
    } catch (err) {
      // Optionally show error
    } finally {
      setUpdating(null);
    }
  };

  if (!user || user.role !== 'VENDOR') return <div className="flex justify-center items-center h-96 text-gray-500">Orders are only available for vendors.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Vendor Orders</h1>
      <div className="overflow-x-auto rounded-lg shadow bg-white">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.user.firstName} {order.user.lastName}</TableCell>
                <TableCell>{order.total}</TableCell>
                <TableCell>
                  <select
                    value={order.status}
                    disabled={updating === order.id}
                    onChange={e => handleStatusChange(order.id, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    {ORDER_STATUSES.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button size="sm" variant="outline" onClick={() => navigate(`/vendor/orders/${order.id}`)}>
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {/* Pagination Controls */}
      <div className="flex justify-center mt-6 gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={pagination.page <= 1}
          onClick={() => fetchOrders(pagination.page - 1)}
        >
          Previous
        </Button>
        <span className="px-3 py-2 text-sm">Page {pagination.page} of {pagination.pages}</span>
        <Button
          variant="outline"
          size="sm"
          disabled={pagination.page >= pagination.pages}
          onClick={() => fetchOrders(pagination.page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default VendorOrdersPage;

