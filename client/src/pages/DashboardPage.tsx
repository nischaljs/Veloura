import { useEffect, useState } from 'react';
import { getProfile } from '../services/auth';
import { getOrders } from '../services/order';
import { getAddresses } from '../services/user';
import { Card, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getProfile().then(res => res.data.data.user),
      getOrders().then(res => res.data.data.orders),
      getAddresses().then(res => res.data.data.addresses)
    ])
      .then(([user, orders, addresses]) => {
        setProfile(user);
        setOrders(orders);
        setAddresses(addresses);
      })
      .catch(() => setError('Failed to load dashboard data.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center items-center h-96">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-96 text-red-500">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-extrabold mb-8 text-indigo-700">My Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* Profile Card */}
        <Card className="md:col-span-1 p-6 flex flex-col items-center bg-gradient-to-br from-indigo-50 to-pink-50 border-0 shadow-md">
          <img src={profile.avatar || 'https://via.placeholder.com/80x80.png?text=User'} alt="Avatar" className="w-20 h-20 rounded-full border-4 border-pink-300 mb-4 shadow" />
          <CardTitle className="text-xl font-bold mb-1 text-indigo-700">{profile.firstName} {profile.lastName}</CardTitle>
          <div className="text-gray-600 mb-1">{profile.email}</div>
          <div className="text-gray-500 text-sm mb-2">{profile.phone}</div>
          <Button variant="outline" className="mt-2 w-full" onClick={() => navigate('/account')}>Edit Profile</Button>
        </Card>
        {/* Addresses Card */}
        <Card className="md:col-span-2 p-6 bg-white/80 border-0 shadow-md">
          <CardTitle className="text-lg font-bold mb-2 text-pink-600">My Addresses</CardTitle>
          <CardContent className="p-0">
            {addresses.length === 0 ? (
              <div className="text-gray-500">No addresses found.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((addr: any) => (
                  <div key={addr.id} className={`rounded-lg border p-3 ${addr.isDefault ? 'border-indigo-500 bg-indigo-50' : 'border-zinc-200 bg-zinc-50'}`}>
                    <div className="font-semibold">{addr.recipientName}</div>
                    <div className="text-xs text-gray-500 mb-1">{addr.street}, {addr.city}, {addr.state}, {addr.country} {addr.postalCode}</div>
                    <div className="text-xs text-gray-400 mb-1">Phone: {addr.phone}</div>
                    {addr.isDefault && <span className="text-xs text-indigo-600 font-bold">Default</span>}
                  </div>
                ))}
              </div>
            )}
            <Button className="mt-4 bg-gradient-to-r from-indigo-500 to-pink-500 text-white w-full" onClick={() => navigate('/account#addresses')}>Manage Addresses</Button>
          </CardContent>
        </Card>
      </div>
      {/* Orders Card */}
      <Card className="p-6 bg-white/80 border-0 shadow-md mb-8">
        <CardTitle className="text-lg font-bold mb-2 text-indigo-600">Recent Orders</CardTitle>
        <CardContent className="p-0">
          {orders.length === 0 ? (
            <div className="text-gray-500">No orders found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-indigo-100">
                    <th className="px-3 py-2 text-left font-semibold">Order #</th>
                    <th className="px-3 py-2 text-left font-semibold">Date</th>
                    <th className="px-3 py-2 text-left font-semibold">Status</th>
                    <th className="px-3 py-2 text-left font-semibold">Total</th>
                    <th className="px-3 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((order: any) => (
                    <tr key={order.id} className="border-b last:border-b-0">
                      <td className="px-3 py-2 font-mono">{order.id}</td>
                      <td className="px-3 py-2">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="px-3 py-2 capitalize">{order.status}</td>
                      <td className="px-3 py-2 font-semibold text-indigo-700">Rs.{order.total}</td>
                      <td className="px-3 py-2">
                        <Button size="sm" variant="outline" onClick={() => navigate(`/orders/${order.id}`)}>View</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <Button className="mt-4 w-full" variant="outline" onClick={() => navigate('/orders')}>View All Orders</Button>
        </CardContent>
      </Card>
      {/* Change Password */}
      <Card className="p-6 bg-gradient-to-r from-pink-50 to-indigo-50 border-0 shadow-md">
        <CardTitle className="text-lg font-bold mb-2 text-pink-700">Security</CardTitle>
        <CardContent className="p-0">
          <Button className="w-full bg-gradient-to-r from-pink-500 to-indigo-500 text-white" onClick={() => navigate('/account#password')}>Change Password</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage; 