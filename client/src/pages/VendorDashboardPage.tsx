import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout, DashboardCard, DashboardTable } from '../components/dashboard';
import { getVendorProfile, getVendorAnalytics, uploadLogo, uploadBanner } from '../services/vendor';
import { getProfile } from '../services/auth';
import { User, Vendor, DashboardStats, Product } from '../types';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../context/AuthContext';
import { Skeleton } from '../components/ui/skeleton';
import { toast } from 'sonner';

const VendorDashboardPage: React.FC = () => {
  const { user: authUser, loading: authLoading } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [stats, setStats] = useState<DashboardStats>({});
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Wait for auth to finish loading
        if (authLoading) return;
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
  }, [authUser, authLoading]);

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !vendor) return;
    setUploadingLogo(true);
    try {
      await uploadLogo(file);
      const res = await getVendorProfile();
      setVendor(res.data.data.vendor);
      toast.success('Logo updated!');
    } catch (err: any) {
      toast.error('Failed to upload logo');
    } finally {
      setUploadingLogo(false);
      if (logoInputRef.current) logoInputRef.current.value = '';
    }
  };

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !vendor) return;
    setUploadingBanner(true);
    try {
      await uploadBanner(file);
      const res = await getVendorProfile();
      setVendor(res.data.data.vendor);
      toast.success('Cover image updated!');
    } catch (err: any) {
      toast.error('Failed to upload cover image');
    } finally {
      setUploadingBanner(false);
      if (bannerInputRef.current) bannerInputRef.current.value = '';
    }
  };

  if (authLoading) {
    return (
      <DashboardLayout userRole="VENDOR">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading authentication...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (loading) {
    return (
      <DashboardLayout userRole="VENDOR" user={user || undefined}>
        <div className="space-y-6">
          {/* Cover Image Skeleton */}
          <div className="w-full h-40 rounded-lg bg-gray-200 mb-4">
            <Skeleton className="w-full h-full rounded-lg" />
          </div>
          {/* Profile Card Skeleton */}
          <div className="flex items-center gap-4 mb-4">
            <Skeleton className="w-16 h-16 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
          {/* Stats Skeleton */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-lg" />)}
          </div>
          {/* Products Skeleton */}
          <div className="mt-6">
            <Skeleton className="h-8 w-1/4 mb-2" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
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

  if (!vendor && !loading) {
    return (
      <DashboardLayout userRole="VENDOR">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-500">Failed to load vendor profile.</div>
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
        {/* Cover Image */}
        <div className="w-full h-40 rounded-lg overflow-hidden mb-4 relative group">
          {vendor?.banner ? (
            <>
              <img src={vendor.banner} alt="Cover" className="w-full h-full object-cover" />
              <button
                className="absolute top-2 right-2 bg-white/80 hover:bg-white px-3 py-1 rounded shadow text-xs font-medium hidden group-hover:block"
                onClick={() => bannerInputRef.current?.click()}
                disabled={uploadingBanner}
                type="button"
              >
                {uploadingBanner ? 'Uploading...' : 'Update Cover'}
              </button>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 cursor-pointer" onClick={() => bannerInputRef.current?.click()}>
              <span className="text-gray-400 text-2xl mb-2">🖼️</span>
              <span className="text-gray-500 text-sm">Upload Cover Image</span>
            </div>
          )}
          <input
            ref={bannerInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleBannerChange}
            disabled={uploadingBanner}
          />
        </div>
        {/* Business Info Card */}
        {vendor && (
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border relative">
            {/* Profile Image */}
            <div className="absolute -top-8 left-6">
              {vendor.logo ? (
                <div className="relative group">
                  <img src={vendor.logo} alt={vendor.businessName || 'Vendor'} className="w-16 h-16 rounded-lg object-cover border-4 border-white shadow" />
                  <button
                    className="absolute inset-0 bg-black/30 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                    style={{ pointerEvents: uploadingLogo ? 'none' : 'auto' }}
                    onClick={() => logoInputRef.current?.click()}
                    disabled={uploadingLogo}
                    type="button"
                  >
                    {uploadingLogo ? 'Uploading...' : 'Update'}
                  </button>
                </div>
              ) : (
                <div className="w-16 h-16 rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer" onClick={() => logoInputRef.current?.click()}>
                  <span className="text-gray-400 text-2xl">🏪</span>
                  <span className="text-gray-500 text-xs">Upload Logo</span>
                </div>
              )}
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoChange}
                disabled={uploadingLogo}
              />
            </div>
            <div className="flex items-center gap-4 pl-24">
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
            isCurrency={true}
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
            isCurrency={true}
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