import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import DashboardTable from '../components/dashboard/DashboardTable';
import { getVendorReviews } from '../services/review';
import { Badge } from '../components/ui/badge';
import { Star } from 'lucide-react';

interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  product: {
    name: string;
    slug: string;
  };
  user: {
    firstName: string;
    lastName: string;
  };
}

const VendorReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getVendorReviews();
        setReviews(res.data.data.reviews);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch reviews');
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const reviewTableColumns = [
    { key: 'product', label: 'Product', render: (value: any, row: Review) => (
      <span className="font-semibold">{row.product.name}</span>
    )},
    { key: 'user', label: 'Customer', render: (value: any, row: Review) => (
      <span>{row.user.firstName} {row.user.lastName}</span>
    )},
    { key: 'rating', label: 'Rating', render: (value: any) => (
      <div className="flex items-center">
        {Array.from({ length: value }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        ))}
        {Array.from({ length: 5 - value }).map((_, i) => (
          <Star key={i} className="h-4 w-4 text-gray-300" />
        ))}
      </div>
    )},
    { key: 'comment', label: 'Comment', render: (value: any) => (
      <p className="text-sm text-gray-600 line-clamp-2">{value}</p>
    )},
    { key: 'createdAt', label: 'Date', render: (value: any) => (
      <span className="text-sm">{new Date(value).toLocaleDateString()}</span>
    )},
  ];

  return (
    <DashboardLayout userRole="VENDOR">
      <div className="w-full px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">Vendor Reviews</h1>
        <DashboardTable
          title="All Reviews"
          data={reviews}
          columns={reviewTableColumns}
          loading={loading}
          emptyMessage={error || 'No reviews found'}
        />
      </div>
    </DashboardLayout>
  );
};

export default VendorReviewsPage;