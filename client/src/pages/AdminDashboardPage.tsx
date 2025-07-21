
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardAnalytics } from "@/services/admin";
import Shimmer from "@/components/ui/Shimmer";

const AdminDashboardPage = () => {
  const [analytics, setAnalytics] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalVendors: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await getDashboardAnalytics();
        setAnalytics(response.data.analytics);
      } catch (error) {
        console.error("Failed to fetch admin dashboard analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? <Shimmer /> : <p className="text-4xl font-bold">Rs.{analytics.totalSales.toFixed(2)}</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? <Shimmer /> : <p className="text-4xl font-bold">{analytics.totalOrders}</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? <Shimmer /> : <p className="text-4xl font-bold">{analytics.totalUsers}</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Vendors</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? <Shimmer /> : <p className="text-4xl font-bold">{analytics.totalVendors}</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
