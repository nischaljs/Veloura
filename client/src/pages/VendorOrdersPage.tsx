
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getVendorOrders } from "@/services/order"; // Corrected import
import { Order } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const VendorOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  const navigate = useNavigate();

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getVendorOrders({ page, limit: pagination.limit });
      setOrders(res.data.data.orders);
      setPagination(res.data.data.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(pagination.page);
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Vendor Orders</h1>
      <Table>
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
                <Badge variant={
                  order.status === 'DELIVERED' ? 'default' :
                  order.status === 'PENDING' ? 'secondary' :
                  order.status === 'CANCELLED' ? 'destructive' : 'outline'
                }>
                  {order.status}
                </Badge>
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
