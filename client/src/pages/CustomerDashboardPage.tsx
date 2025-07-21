
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserDashboardAnalytics } from "@/services/user";
import { DollarSign, ShoppingBag, User } from "lucide-react";
import Shimmer from "@/components/ui/Shimmer";

const CustomerDashboardPage = () => {
  const [analytics, setAnalytics] = useState({
    totalOrders: 0,
    totalSpent: 0,
    // Add more relevant customer metrics here if available from API
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await getUserDashboardAnalytics();
        setAnalytics(response.data);
      } catch (error) {
        console.error("Failed to fetch customer dashboard analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="space-y-6 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800">Customer Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-6 w-6 text-gray-500" />
          </CardHeader>
          <CardContent>
            {loading ? <Shimmer /> : <div className="text-4xl font-bold text-indigo-600">{analytics.totalOrders}</div>}
            <p className="text-xs text-gray-500">Orders placed</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-6 w-6 text-gray-500" />
          </CardHeader>
          <CardContent>
            {loading ? <Shimmer /> : <div className="text-4xl font-bold text-green-600">Rs.{analytics.totalSpent.toFixed(2)}</div>}
            <p className="text-xs text-gray-500">Money spent on purchases</p>
          </CardContent>
        </Card>

        {/* Example of another card, if more data becomes available */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Status</CardTitle>
            <User className="h-6 w-6 text-gray-500" />
          </CardHeader>
          <CardContent>
            {loading ? <Shimmer /> : <div className="text-2xl font-bold text-purple-600">Complete</div>}
            <p className="text-xs text-gray-500">Your profile information</p>
          </CardContent>
        </Card>
      </div>

      {/* You can add more sections here, e.g., recent orders, recommended products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? <Shimmer /> : <p className="text-gray-500">Display a list of recent orders here.</p>}
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Recommended Products</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? <Shimmer /> : <p className="text-gray-500">Show personalized product recommendations.</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerDashboardPage;
