
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getVendorProfile, getMyProducts, getPayoutRequests } from "@/services/vendor";
import { getVendorOrders } from "@/services/order";
import Shimmer from "@/components/ui/Shimmer";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { updateProductStock } from '@/services/product';

const VendorDashboardPage = () => {
  const [analytics, setAnalytics] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
  });
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [payouts, setPayouts] = useState([]);
  const [payoutsLoading, setPayoutsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch product count
    const fetchProducts = async () => {
      setProductsLoading(true);
      try {
        const response = await getMyProducts();
        setProducts(response.data.data.products || []);
      } catch (error) {
        setProducts([]);
      } finally {
        setProductsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    // Quick fix: Fetch all vendor orders and calculate analytics
    const fetchOrdersForAnalytics = async () => {
      setLoading(true);
      try {
        const response = await getVendorOrders({ page: 1, limit: 100 });
        const orders = response.data.data.orders || [];
        const totalOrders = orders.length;
        const totalSales = orders.reduce((sum, order) => sum + parseFloat(order.total || 0), 0);
        setAnalytics((prev) => ({
          ...prev,
          totalOrders,
          totalSales,
        }));
      } catch (error) {
        setAnalytics((prev) => ({ ...prev, totalOrders: 0, totalSales: 0 }));
      } finally {
        setLoading(false);
      }
    };
    fetchOrdersForAnalytics();
  }, []);

  useEffect(() => {
    // Set product count after products are loaded
    setAnalytics((prev) => ({ ...prev, totalProducts: products.length }));
  }, [products]);

  useEffect(() => {
    const fetchProfile = async () => {
      setProfileLoading(true);
      try {
        const response = await getVendorProfile();
        setProfile(response.data.vendor);
      } catch (error) {
        setProfile(null);
      } finally {
        setProfileLoading(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      setOrdersLoading(true);
      try {
        const response = await getVendorOrders({ page: 1, limit: 5 });
        setOrders(response.data.data.orders || []);
      } catch (error) {
        setOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchPayouts = async () => {
      setPayoutsLoading(true);
      try {
        const response = await getPayoutRequests();
        setPayouts(response.data.payouts || []);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setPayouts(null); // null means payouts not available
        } else {
          setPayouts([]);
        }
      } finally {
        setPayoutsLoading(false);
      }
    };
    fetchPayouts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Vendor Dashboard</h1>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card className="col-span-1 flex flex-col items-center justify-center p-4 cursor-pointer hover:shadow-lg transition" onClick={() => navigate('/vendor/products/add')}>
          <CardTitle className="text-lg font-semibold mb-2">Add Product</CardTitle>
          <Button variant="outline" onClick={() => navigate('/vendor/products/add')}>Add Product</Button>
        </Card>
        <Card className="col-span-1 flex flex-col items-center justify-center p-4 cursor-pointer hover:shadow-lg transition" onClick={() => navigate('/vendor/products')}>
          <CardTitle className="text-lg font-semibold mb-2">View Products</CardTitle>
          <Button variant="outline" onClick={() => navigate('/vendor/products')}>View All</Button>
        </Card>
        <Card className="col-span-1 flex flex-col items-center justify-center p-4 cursor-pointer hover:shadow-lg transition" onClick={() => navigate('/vendor/orders')}>
          <CardTitle className="text-lg font-semibold mb-2">View Orders</CardTitle>
          <Button variant="outline" onClick={() => navigate('/vendor/orders')}>Orders</Button>
        </Card>
        <Card className="col-span-1 flex flex-col items-center justify-center p-4 cursor-pointer hover:shadow-lg transition" onClick={() => navigate('/vendor/payouts')}>
          <CardTitle className="text-lg font-semibold mb-2">Request Payout</CardTitle>
          <Button variant="outline" onClick={() => navigate('/vendor/payouts')}>Payouts</Button>
        </Card>
        <Card className="col-span-1 flex flex-col items-center justify-center p-4 cursor-pointer hover:shadow-lg transition" onClick={() => navigate('/vendor/profile')}>
          <CardTitle className="text-lg font-semibold mb-2">Edit Profile</CardTitle>
          <Button variant="outline" onClick={() => navigate('/vendor/profile')}>Edit</Button>
        </Card>
      </div>

      {/* Vendor Info */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {profileLoading ? <Skeleton className="w-48 h-8" /> : profile?.businessName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {profileLoading ? (
            <Skeleton className="w-full h-6 mb-2" />
          ) : (
            <>
              <div className="text-gray-600 mb-2">{profile?.description}</div>
              <div className="flex gap-4 flex-wrap mb-2">
                {profile?.businessEmail && <Badge variant="outline">Email: {profile.businessEmail}</Badge>}
                {profile?.businessPhone && <Badge variant="outline">Phone: {profile.businessPhone}</Badge>}
                {profile?.website && <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Website</a>}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
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
            <CardTitle>Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? <Shimmer /> : <p className="text-4xl font-bold">{analytics.totalProducts}</p>}
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex justify-between items-center">
            Recent Orders
            <Button variant="link" className="text-indigo-600" onClick={() => navigate('/vendor/orders')}>View All</Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {ordersLoading ? (
            <Skeleton className="w-full h-12 mb-2" />
          ) : orders.length === 0 ? (
            <div className="text-gray-500 text-center py-4">No recent orders.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left py-2 px-2">Order #</th>
                    <th className="text-left py-2 px-2">Customer</th>
                    <th className="text-left py-2 px-2">Total</th>
                    <th className="text-left py-2 px-2">Status</th>
                    <th className="text-left py-2 px-2">Date</th>
                    <th className="text-left py-2 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} className="border-b">
                      <td className="py-2 px-2 font-mono">{order.orderNumber}</td>
                      <td className="py-2 px-2">{order.user?.firstName} {order.user?.lastName}</td>
                      <td className="py-2 px-2">Rs.{order.total}</td>
                      <td className="py-2 px-2">
                        <Badge variant={
                          order.status === 'DELIVERED' ? 'default' :
                          order.status === 'PENDING' ? 'secondary' :
                          order.status === 'CANCELLED' ? 'destructive' : 'outline'
                        }>
                          {order.status}
                        </Badge>
                      </td>
                      <td className="py-2 px-2">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="py-2 px-2">
                        <Button size="sm" variant="outline" onClick={() => navigate(`/vendor/orders/${order.id}`)}>
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Payouts */}
      {payouts !== null && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex justify-between items-center">
              Recent Payouts
              <Button variant="link" className="text-indigo-600" onClick={() => navigate('/vendor/payouts')}>View All</Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {payoutsLoading ? (
              <Skeleton className="w-full h-12 mb-2" />
            ) : payouts.length === 0 ? (
              <div className="text-gray-500 text-center py-4">No payout requests yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left py-2 px-2">Amount</th>
                      <th className="text-left py-2 px-2">Status</th>
                      <th className="text-left py-2 px-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payouts.slice(0, 5).map(payout => (
                      <tr key={payout.id} className="border-b">
                        <td className="py-2 px-2">Rs.{payout.amount}</td>
                        <td className="py-2 px-2">{payout.status}</td>
                        <td className="py-2 px-2">{new Date(payout.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      {payouts === null && (
        <div className="mb-8 text-center text-gray-500">Payouts are not available.</div>
      )}

      {/* Products Grid */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Your Products</h2>
          <Button variant="outline" onClick={() => navigate('/vendor/products/add')}>Add Product</Button>
        </div>
        {productsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-xl" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-gray-500 text-center py-8">No products found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map(product => (
              <Card key={product.id} className="cursor-pointer hover:shadow-lg transition" onClick={() => navigate(`/products/${product.slug}`)}>
                <div className="w-full h-48 bg-gray-100 rounded-t-lg overflow-hidden flex items-center justify-center">
                  {product.images && product.images.length > 0 ? (
                    <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-5xl">📦</div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-gray-600 text-sm line-clamp-2 mb-2">{product.shortDescription || product.description}</div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">Rs.{product.price}</span>
                    <span className="text-xs text-gray-500">Stock: {product.stockQuantity}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Category: {product.category ? (
                      <Link to={`/category/${product.category.slug}`} className="text-indigo-600 hover:underline">{product.category.name}</Link>
                    ) : 'N/A'}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add inventory management UI below products grid */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Inventory Management</h2>
        <div className="overflow-x-auto rounded-lg shadow bg-white">
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="text-left py-2 px-2">Product</th>
                <th className="text-left py-2 px-2">SKU</th>
                <th className="text-left py-2 px-2">Stock</th>
                <th className="text-left py-2 px-2">Status</th>
                <th className="text-left py-2 px-2">Update Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b">
                  <td className="py-2 px-2">{product.name}</td>
                  <td className="py-2 px-2">{product.sku}</td>
                  <td className="py-2 px-2">{product.stockQuantity}</td>
                  <td className="py-2 px-2">{product.status}</td>
                  <td className="py-2 px-2">
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        const newStock = formData.get('stock');
                        if (!newStock) return;
                        await updateProductStock(product.id, parseInt(newStock as string));
                        // Refresh products after update
                        const response = await getMyProducts();
                        setProducts(response.data.data.products || []);
                      }}
                      className="flex gap-2 items-center"
                    >
                      <input
                        type="number"
                        name="stock"
                        min="0"
                        defaultValue={product.stockQuantity}
                        className="border rounded px-2 py-1 w-20"
                      />
                      <Button type="submit" size="sm">Update</Button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboardPage;
