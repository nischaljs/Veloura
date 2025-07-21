
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getDashboardAnalytics, getUsers, getVendors, getOrders, getPayoutRequests } from "@/services/admin";
import Shimmer from "@/components/ui/Shimmer";
import { useNavigate } from "react-router-dom";

const AdminDashboardPage = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [recentVendors, setRecentVendors] = useState<any[]>([]);
  const [recentPayouts, setRecentPayouts] = useState<any[]>([]);
  const [loadingTables, setLoadingTables] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await getDashboardAnalytics();
        if (response.data && response.data.analytics) {
          setAnalytics(response.data.analytics);
        } else if (response.data && response.data.data && response.data.data.analytics) {
          setAnalytics(response.data.data.analytics);
        } else if (response.data && response.data.message) {
          setError(response.data.message);
        } else {
          setError("Failed to load analytics data.");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch admin dashboard analytics.");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  useEffect(() => {
    const fetchTables = async () => {
      setLoadingTables(true);
      try {
        const [ordersRes, usersRes, vendorsRes, payoutsRes] = await Promise.all([
          getOrders({ page: 1, limit: 5 }),
          getUsers({ page: 1, limit: 5 }),
          getVendors({ page: 1, limit: 5 }),
          getPayoutRequests(),
        ]);
        setRecentOrders(ordersRes.data.data.orders || []);
        setRecentUsers(usersRes.data.data.users || []);
        setRecentVendors(vendorsRes.data.data.vendors || []);
        setRecentPayouts((payoutsRes.data.payouts || []).slice(0, 5));
      } catch (err) {
        // Optionally handle error
      } finally {
        setLoadingTables(false);
      }
    };
    fetchTables();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardHeader><CardTitle>Total Sales</CardTitle></CardHeader>
          <CardContent>
            {loading ? <Shimmer /> : <p className="text-3xl font-bold">Rs.{(() => {
              let val = analytics?.totalSales;
              if (typeof val === 'string') val = parseFloat(val);
              if (typeof val !== 'number' || isNaN(val)) val = 0;
              return val.toFixed(2);
            })()}</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Total Orders</CardTitle></CardHeader>
          <CardContent>
            {loading ? <Shimmer /> : <p className="text-3xl font-bold">{(() => {
              let val = analytics?.totalOrders;
              if (typeof val === 'string') val = parseInt(val);
              if (typeof val !== 'number' || isNaN(val)) val = 0;
              return val;
            })()}</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Total Users</CardTitle></CardHeader>
          <CardContent>
            {loading ? <Shimmer /> : <p className="text-3xl font-bold">{(() => {
              let val = analytics?.totalUsers;
              if (typeof val === 'string') val = parseInt(val);
              if (typeof val !== 'number' || isNaN(val)) val = 0;
              return val;
            })()}</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Total Vendors</CardTitle></CardHeader>
          <CardContent>
            {loading ? <Shimmer /> : <p className="text-3xl font-bold">{(() => {
              let val = analytics?.totalVendors;
              if (typeof val === 'string') val = parseInt(val);
              if (typeof val !== 'number' || isNaN(val)) val = 0;
              return val;
            })()}</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Pending Vendors</CardTitle></CardHeader>
          <CardContent>
            {loading ? <Shimmer /> : <p className="text-3xl font-bold text-yellow-600">{(() => {
              let val = analytics?.pendingVendors;
              if (typeof val === 'string') val = parseInt(val);
              if (typeof val !== 'number' || isNaN(val)) val = 0;
              return val;
            })()}</p>}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-10">
        <Card className="cursor-pointer hover:shadow-lg transition" onClick={() => navigate('/admin/users')}>
          <CardContent className="py-4 text-center font-medium">Manage Users</CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition" onClick={() => navigate('/admin/vendors')}>
          <CardContent className="py-4 text-center font-medium">Manage Vendors</CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition" onClick={() => navigate('/admin/products')}>
          <CardContent className="py-4 text-center font-medium">Manage Products</CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition" onClick={() => navigate('/admin/orders')}>
          <CardContent className="py-4 text-center font-medium">Manage Orders</CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition" onClick={() => navigate('/admin/categories')}>
          <CardContent className="py-4 text-center font-medium">Manage Categories</CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition" onClick={() => navigate('/admin/payouts')}>
          <CardContent className="py-4 text-center font-medium">Manage Payouts</CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition" onClick={() => navigate('/admin/settings')}>
          <CardContent className="py-4 text-center font-medium">Settings</CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition" onClick={() => navigate('/admin/coupons')}>
          <CardContent className="py-4 text-center font-medium">Coupons</CardContent>
        </Card>
      </div>

      {/* Recent Data Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {/* Recent Orders */}
        <Card className="overflow-x-auto">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Button variant="link" onClick={() => navigate('/admin/orders')}>View All</Button>
          </CardHeader>
          <CardContent>
            {loadingTables ? <Shimmer /> : (
              <table className="min-w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left py-2 px-2">Order #</th>
                    <th className="text-left py-2 px-2">Customer</th>
                    <th className="text-left py-2 px-2">Total</th>
                    <th className="text-left py-2 px-2">Status</th>
                    <th className="text-left py-2 px-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => (
                    <tr key={order.id} className="border-b">
                      <td className="py-2 px-2 whitespace-nowrap">{order.id}</td>
                      <td className="py-2 px-2 truncate max-w-[120px]">{order.user?.firstName} {order.user?.lastName}</td>
                      <td className="py-2 px-2">Rs.{order.total}</td>
                      <td className="py-2 px-2">{order.status}</td>
                      <td className="py-2 px-2">{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
        {/* Recent Users */}
        <Card className="overflow-x-auto">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Users</CardTitle>
            <Button variant="link" onClick={() => navigate('/admin/users')}>View All</Button>
          </CardHeader>
          <CardContent>
            {loadingTables ? <Shimmer /> : (
              <table className="min-w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left py-2 px-2">ID</th>
                    <th className="text-left py-2 px-2">Name</th>
                    <th className="text-left py-2 px-2">Email</th>
                    <th className="text-left py-2 px-2">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map(user => (
                    <tr key={user.id} className="border-b">
                      <td className="py-2 px-2 whitespace-nowrap">{user.id}</td>
                      <td className="py-2 px-2 truncate max-w-[120px]">{user.firstName} {user.lastName}</td>
                      <td className="py-2 px-2 truncate max-w-[140px]">{user.email}</td>
                      <td className="py-2 px-2">{user.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Recent Vendors */}
        <Card className="overflow-x-auto">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Vendors</CardTitle>
            <Button variant="link" onClick={() => navigate('/admin/vendors')}>View All</Button>
          </CardHeader>
          <CardContent>
            {loadingTables ? <Shimmer /> : (
              <table className="min-w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left py-2 px-2">ID</th>
                    <th className="text-left py-2 px-2">Business Name</th>
                    <th className="text-left py-2 px-2">Email</th>
                    <th className="text-left py-2 px-2">Approved</th>
                  </tr>
                </thead>
                <tbody>
                  {recentVendors.map(vendor => (
                    <tr key={vendor.id} className="border-b">
                      <td className="py-2 px-2 whitespace-nowrap">{vendor.id}</td>
                      <td className="py-2 px-2 truncate max-w-[120px]">{vendor.businessName}</td>
                      <td className="py-2 px-2 truncate max-w-[140px]">{vendor.businessEmail}</td>
                      <td className="py-2 px-2">{vendor.isApproved ? 'Yes' : 'No'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
        {/* Recent Payouts */}
        <Card className="overflow-x-auto">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Payouts</CardTitle>
            <Button variant="link" onClick={() => navigate('/admin/payouts')}>View All</Button>
          </CardHeader>
          <CardContent>
            {loadingTables ? <Shimmer /> : (
              <table className="min-w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left py-2 px-2">Vendor</th>
                    <th className="text-left py-2 px-2">Amount</th>
                    <th className="text-left py-2 px-2">Status</th>
                    <th className="text-left py-2 px-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPayouts.map(payout => (
                    <tr key={payout.id} className="border-b">
                      <td className="py-2 px-2 whitespace-nowrap">{payout.vendorId}</td>
                      <td className="py-2 px-2">Rs.{payout.amount}</td>
                      <td className="py-2 px-2">{payout.status}</td>
                      <td className="py-2 px-2">{new Date(payout.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>
      {error && <div className="text-center text-red-500 text-lg py-12">{error}</div>}
    </div>
  );
};

export default AdminDashboardPage;
