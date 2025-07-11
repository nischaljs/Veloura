import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { getDashboardAnalytics, getUserAnalytics, getVendorAnalytics, getSalesAnalytics } from '../services/admin';
import { DashboardStats } from '../types';
import { toast } from 'sonner';

const AdminAnalyticsPage: React.FC = () => {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({});
  const [userStats, setUserStats] = useState<any>({});
  const [vendorStats, setVendorStats] = useState<any>({});
  const [salesStats, setSalesStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);
      try {
        const [dashboardRes, userRes, vendorRes, salesRes] = await Promise.all([
          getDashboardAnalytics(),
          getUserAnalytics(),
          getVendorAnalytics(),
          getSalesAnalytics(),
        ]);
        setDashboardStats(dashboardRes.data.data?.analytics || {});
        setUserStats(userRes.data.data?.analytics || {});
        setVendorStats(vendorRes.data.data?.analytics || {});
        setSalesStats(salesRes.data.data?.analytics || {});
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch analytics');
        toast.error(err.response?.data?.message || 'Failed to fetch analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <DashboardLayout userRole="ADMIN">
        <div className="w-full px-8 py-8">
          <h1 className="text-3xl font-bold mb-6">Analytics</h1>
          <Card>
            <CardHeader><CardTitle>Loading Analytics...</CardTitle></CardHeader>
            <CardContent>Loading...</CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout userRole="ADMIN">
        <div className="w-full px-8 py-8">
          <h1 className="text-3xl font-bold mb-6">Analytics</h1>
          <Card>
            <CardHeader><CardTitle>Error</CardTitle></CardHeader>
            <CardContent className="text-red-500">{error}</CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="ADMIN">
      <div className="w-full px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">Analytics Overview</h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardHeader><CardTitle>Total Sales</CardTitle></CardHeader>
            <CardContent className="text-2xl font-bold">Rs.{dashboardStats.totalSales?.toLocaleString() || 0}</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Total Orders</CardTitle></CardHeader>
            <CardContent className="text-2xl font-bold">{dashboardStats.totalOrders || 0}</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Total Users</CardTitle></CardHeader>
            <CardContent className="text-2xl font-bold">{dashboardStats.totalUsers || 0}</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Total Vendors</CardTitle></CardHeader>
            <CardContent className="text-2xl font-bold">{dashboardStats.totalVendors || 0}</CardContent>
          </Card>
        </div>

        <h2 className="text-2xl font-bold mb-4">User Analytics</h2>
        <Card className="mb-6">
          <CardHeader><CardTitle>User Demographics</CardTitle></CardHeader>
          <CardContent>
            <p>Total Active Users: {userStats.activeUsers || 0}</p>
            <p>New Users Last 30 Days: {userStats.newUsersLast30Days || 0}</p>
            {/* Add more user-specific analytics here */}
          </CardContent>
        </Card>

        <h2 className="text-2xl font-bold mb-4">Vendor Analytics</h2>
        <Card className="mb-6">
          <CardHeader><CardTitle>Vendor Performance</CardTitle></CardHeader>
          <CardContent>
            <p>Approved Vendors: {vendorStats.approvedVendors || 0}</p>
            <p>Pending Vendors: {vendorStats.pendingVendors || 0}</p>
            {/* Add more vendor-specific analytics here */}
          </CardContent>
        </Card>

        <h2 className="text-2xl font-bold mb-4">Sales Analytics</h2>
        <Card className="mb-6">
          <CardHeader><CardTitle>Sales Trends</CardTitle></CardHeader>
          <CardContent>
            <p>Monthly Sales: Rs.{salesStats.monthlySales?.toLocaleString() || 0}</p>
            <p>Top Selling Products: {salesStats.topSellingProducts?.map((p: any) => p.name).join(', ') || 'N/A'}</p>
            {/* Add more sales-specific analytics here */}
          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  );
};

export default AdminAnalyticsPage;