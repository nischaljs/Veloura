import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getVendorReviews } from "@/services/review";
import { Skeleton } from "@/components/ui/skeleton";

const VendorReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getVendorReviews();
        setReviews(res.data.data.reviews || []);
      } catch (err) {
        setError("Failed to fetch reviews");
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>My Product Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? <Skeleton className="w-full h-12 mb-2" /> : error ? (
            <div className="text-red-500 text-center py-4">{error}</div>
          ) : reviews.length === 0 ? (
            <div className="text-gray-500 text-center py-4">No reviews found.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="min-w-full text-sm">
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Comment</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell>{review.product?.name || "-"}</TableCell>
                      <TableCell>{review.rating}</TableCell>
                      <TableCell>{review.title}</TableCell>
                      <TableCell>{review.comment}</TableCell>
                      <TableCell>{new Date(review.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorReviewsPage; 