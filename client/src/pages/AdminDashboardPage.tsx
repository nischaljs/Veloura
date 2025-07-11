import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout, DashboardCard, DashboardTable } from '../components/dashboard';
import { getUsers, getVendors, getDashboardAnalytics } from '../services/admin';
import { getProfile } from '../services/auth';
import { User, Vendor, DashboardStats } from '../types';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

const AdminDashboardPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<DashboardStats>({});
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [recentVendors, setRecentVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [userRes, statsRes, usersRes, vendorsRes] = await Promise.all([
          getProfile(),
          getDashboardAnalytics(),
          getUsers({ page: 1, limit: 5 }),
          getVendors({ page: 1, limit: 5 })
        ]);

        setUser(userRes.data.data.user);
        setStats(statsRes.data.data?.analytics || {});
        setRecentUsers(usersRes.data.data?.users || []);
        setRecentVendors(vendorsRes.data.data?.vendors || []);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout userRole="ADMIN" user={user || undefined}>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading dashboard...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout userRole="ADMIN" user={user || undefined}>
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">{error}</div>
        </div>
      </DashboardLayout>
    );
  }

  const userTableColumns = [
    { key: 'name', label: 'Name', render: (value: any, row: User) => (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
          {row.firstName?.[0]}{row.lastName?.[0]}
        </div>
        <div>
          <div className="font-medium">{row.firstName} {row.lastName}</div>
          <div className="text-sm text-muted-foreground">{row.email}</div>
        </div>
      </div>
    )},
    { key: 'role', label: 'Role', render: (value: any) => (
      <Badge variant={value === 'ADMIN' ? 'destructive' : value === 'VENDOR' ? 'default' : 'secondary'}>
        {value}
      </Badge>
    )},
    { key: 'status', label: 'Status', render: (value: any, row: User) => (
      <Badge variant={row.isActive ? 'default' : 'secondary'}>
        {row.isActive ? 'Active' : 'Inactive'}
      </Badge>
    )},
    { key: 'createdAt', label: 'Joined', render: (value: any) => (
      <span className="text-sm text-muted-foreground">
        {new Date(value).toLocaleDateString()}
      </span>
    )}
  ];

  const vendorTableColumns = [
    { key: 'businessName', label: 'Business', render: (value: any, row: Vendor) => (
      <div>
        <div className="font-medium">{value}</div>
        <div className="text-sm text-muted-foreground">{row.businessEmail}</div>
      </div>
    )},
    { key: 'status', label: 'Status', render: (value: any, row: Vendor) => (
      <Badge variant={row.isApproved ? 'default' : 'secondary'}>
        {row.isApproved ? 'Approved' : 'Pending'}
      </Badge>
    )},
    { key: 'createdAt', label: 'Registered', render: (value: any) => (
      <span className="text-sm text-muted-foreground">
        {new Date(value).toLocaleDateString()}
      </span>
    )}
  ];

  return (
    <DashboardLayout userRole="ADMIN" user={user || undefined}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your store today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            title="Total Users"
            value={stats.totalUsers || 0}
            description="Active users in the system"
            icon="👥"
          />
          <DashboardCard
            title="Total Vendors"
            value={stats.totalVendors || 0}
            description="Registered vendors"
            icon="🏪"
          />
          <DashboardCard
            title="Pending Vendors"
            value={stats.pendingVendors || 0}
            description="Awaiting approval"
            icon="⏳"
          />
          <DashboardCard
            title="Total Sales"
            value={stats.totalSales || 0}
            description="Total revenue generated"
            icon="💰"
          />
        </div>

        {/* Tables */}
        <div className="grid gap-6 md:grid-cols-2">
          <DashboardTable
            title="Recent Users"
            data={recentUsers}
            columns={userTableColumns}
            emptyMessage="No users found"
          />
          <DashboardTable
            title="Recent Vendors"
            data={recentVendors}
            columns={vendorTableColumns}
            emptyMessage="No vendors found"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          <Button asChild className="h-20 flex-col gap-2">
            <Link to="/admin/users">
              <div className="text-2xl">👥</div>
              <span>Manage Users</span>
            </Link>
          </Button>
          <Button asChild className="h-20 flex-col gap-2">
            <Link to="/admin/vendors">
              <div className="text-2xl">🏪</div>
              <span>Manage Vendors</span>
            </Link>
          </Button>
          <Button asChild className="h-20 flex-col gap-2">
            <Link to="/admin/products">
              <div className="text-2xl">📦</div>
              <span>Manage Products</span>
            </Link>
          </Button>
          <Button asChild className="h-20 flex-col gap-2">
            <Link to="/admin/settings">
              <div className="text-2xl">⚙️</div>
              <span>System Settings</span>
            </Link>
          </Button>
          <Button asChild className="h-20 flex-col gap-2">
            <Link to="/admin/analytics">
              <div className="text-2xl">📈</div>
              <span>View Analytics</span>
            </Link>
          </Button>
          <Button asChild className="h-20 flex-col gap-2">
            <Link to="/admin/activities">
              <div className="text-2xl">📋</div>
              <span>Activity Logs</span>
            </Link>
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboardPage; 