import React, { useEffect, useState } from 'react';
import { DashboardLayout, DashboardCard } from '../components/dashboard';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { getVendorAnalytics } from '../services/vendor';
import { DashboardStats } from '../types';
import { toast } from 'sonner';

const VendorAnalyticsPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getVendorAnalytics()
      .then(res => setStats(res.data.data.analytics || {}))
      .catch(() => toast.error('Failed to load analytics'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout userRole="VENDOR">
      <div className="max-w-5xl mx-auto py-8 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Business Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-8 text-center">Loading analytics...</div>
            ) : (
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
                  title="Average Order Value"
                  value={stats.averageOrderValue || 0}
                  description="Average order value"
                  icon="📊"
                />
                <DashboardCard
                  title="Active Products"
                  value={stats.activeProducts || 0}
                  description="Currently active"
                  icon="✅"
                />
                <DashboardCard
                  title="Total Products"
                  value={stats.totalProducts || 0}
                  description="Products in catalog"
                  icon="📦"
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
            )}
          </CardContent>
        </Card>
        {/* You can add more detailed breakdowns, charts, or tables here if backend provides more analytics */}
      </div>
    </DashboardLayout>
  );
};

export default VendorAnalyticsPage; 