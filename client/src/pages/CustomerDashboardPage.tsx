
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserDashboardAnalytics } from "@/services/user";

const CustomerDashboardPage = () => {
  const [analytics, setAnalytics] = useState({
    totalOrders: 0,
    totalSpent: 0,
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await getUserDashboardAnalytics();
        setAnalytics(response.data);
      } catch (error) {
        console.error("Failed to fetch customer dashboard analytics:", error);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Customer Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{analytics.totalOrders}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">${analytics.totalSpent.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerDashboardPage;
