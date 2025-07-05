import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout, DashboardCard, DashboardTable } from '../components/dashboard';
import { getVendorProfile, getVendorAnalytics } from '../services/vendor';
import { getProfile } from '../services/auth';
import { User, Vendor, DashboardStats, Product } from '../types';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../context/AuthContext';

const VendorDashboardPage: React.FC = () => {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [stats, setStats] = useState<DashboardStats>({});
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Check if user is logged in
        if (!authUser) {
          setError('Please log in to access the vendor dashboard');
          setLoading(false);
          return;
        }

        // Check if user has vendor role
        if (authUser.role !== 'VENDOR' && authUser.role !== 'ADMIN') {
          setError('You need to register as a vendor to access this dashboard');
          setLoading(false);
          return;
        }

        const [userRes, vendorRes, analyticsRes] = await Promise.all([
          getProfile(),
          getVendorProfile(),
          getVendorAnalytics()
        ]);

        setUser(userRes.data.data.user);
        setVendor(vendorRes.data.data.vendor);
        setStats(analyticsRes.data.data?.analytics || {});
        setRecentProducts(vendorRes.data.data.vendor?.products?.slice(0, 5) || []);
      } catch (err: any) {
        console.error('Dashboard error:', err);
        
        if (err.response?.status === 404) {
          setError('You are not registered as a vendor. Please register as a vendor first.');
        } else if (err.response?.status === 401) {
          setError('Please log in to access the vendor dashboard');
        } else if (err.response?.status === 403) {
          setError('You do not have permission to access the vendor dashboard');
        } else {
          setError('Failed to load dashboard data. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [authUser]);

  if (loading) {
    return (
      <DashboardLayout userRole="VENDOR" user={user || undefined}>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading dashboard...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout userRole="VENDOR" user={user || undefined}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center max-w-md">
            <div className="text-red-500 mb-4">{error}</div>
            <div className="space-y-3">
              {!authUser && (
                <Button asChild>
                  <Link to="/login">Login</Link>
                </Button>
              )}
              {authUser && authUser.role !== 'VENDOR' && authUser.role !== 'ADMIN' && (
                <Button asChild>
                  <Link to="/vendor/register">Register as Vendor</Link>
                </Button>
              )}
              {error.includes('not registered as a vendor') && (
                <Button asChild>
                  <Link to="/vendor/register">Register as Vendor</Link>
                </Button>
              )}
              <Button variant="outline" asChild>
                <Link to="/">Go to Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const productTableColumns = [
    { key: 'name', label: 'Product', render: (value: any, row: Product) => (
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center">
          {row.images?.[0] ? (
            <img src={row.images[0]} alt={value} className="w-full h-full object-cover rounded" />
          ) : (
            <span className="text-xs">📦</span>
          )}
        </div>
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-muted-foreground">Rs.{row.price}</div>
        </div>
      </div>
    )},
    { key: 'status', label: 'Status', render: (value: any) => (
      <Badge variant={value === 'ACTIVE' ? 'default' : 'secondary'}>
        {value}
      </Badge>
    )},
    { key: 'createdAt', label: 'Added', render: (value: any) => (
      <span className="text-sm text-muted-foreground">
        {new Date(value).toLocaleDateString()}
      </span>
    )}
  ];

  return (
    <DashboardLayout userRole="VENDOR" user={user || undefined}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vendor Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {vendor?.businessName}! Here's your business overview.
          </p>
        </div>

        {/* Business Info Card */}
        {vendor && (
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border">
            <div className="flex items-center gap-4">
              {vendor.logo && (
                <img src={vendor.logo} alt={vendor.businessName} className="w-16 h-16 rounded-lg object-cover" />
              )}
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{vendor.businessName}</h2>
                <p className="text-muted-foreground">{vendor.businessEmail}</p>
                {vendor.description && (
                  <p className="text-sm text-muted-foreground mt-1">{vendor.description}</p>
                )}
              </div>
              <Badge variant={vendor.isApproved ? 'default' : 'secondary'}>
                {vendor.isApproved ? 'Approved' : 'Pending Approval'}
              </Badge>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            title="Total Sales"
            value={stats.totalSales || 0}
            description="Total revenue generated"
            icon="💰"
          />
          <DashboardCard
            title="Total Orders"
            value={stats.totalOrders || 0}
            description="Orders received"
            icon="📋"
          />
          <DashboardCard
            title="Average Order"
            value={stats.averageOrderValue || 0}
            description="Average order value"
            icon="📊"
          />
          <DashboardCard
            title="Total Products"
            value={stats.totalProducts || 0}
            description="Products in catalog"
            icon="📦"
          />
        </div>

        {/* Additional Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <DashboardCard
            title="Active Products"
            value={stats.activeProducts || 0}
            description="Currently active"
            icon="✅"
          />
          <DashboardCard
            title="Total Reviews"
            value={stats.totalReviews || 0}
            description="Customer reviews"
            icon="⭐"
          />
          <DashboardCard
            title="Average Rating"
            value={stats.averageRating ? `${stats.averageRating.toFixed(1)}/5` : '0/5'}
            description="Customer satisfaction"
            icon="🏆"
          />
        </div>

        {/* Recent Products */}
        <DashboardTable
          title="Recent Products"
          data={recentProducts}
          columns={productTableColumns}
          emptyMessage="No products found"
        />

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-4">
          <Button asChild className="h-20 flex-col gap-2">
            <Link to="/vendor/products">
              <div className="text-2xl">📦</div>
              <span>Manage Products</span>
            </Link>
          </Button>
          <Button asChild className="h-20 flex-col gap-2">
            <Link to="/vendor/orders">
              <div className="text-2xl">📋</div>
              <span>View Orders</span>
            </Link>
          </Button>
          <Button asChild className="h-20 flex-col gap-2">
            <Link to="/vendor/analytics">
              <div className="text-2xl">📈</div>
              <span>Analytics</span>
            </Link>
          </Button>
          <Button asChild className="h-20 flex-col gap-2">
            <Link to="/vendor/profile">
              <div className="text-2xl">⚙️</div>
              <span>Settings</span>
            </Link>
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VendorDashboardPage; 