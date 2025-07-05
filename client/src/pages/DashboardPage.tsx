import { useEffect, useState } from 'react';
import { getProfile } from '../services/auth';
import { getOrders } from '../services/order';
import { getAddresses } from '../services/user';
import { DashboardLayout, DashboardCard, DashboardTable } from '../components/dashboard';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useNavigate } from 'react-router-dom';
import { User, Order, Address } from '../types';
import { 
  User as UserIcon, 
  MapPin, 
  Lock, 
  ShoppingBag, 
  Calendar,
  Phone,
  Mail,
  Edit,
  Eye,
  Plus
} from 'lucide-react';
import EditProfileModal from '../components/modals/EditProfileModal';
import ChangePasswordModal from '../components/modals/ChangePasswordModal';
import AddressModal from '../components/modals/AddressModal';

const DashboardPage = () => {
  const [profile, setProfile] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const navigate = useNavigate();

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [userRes, ordersRes, addressesRes] = await Promise.all([
        getProfile(),
        getOrders(),
        getAddresses()
      ]);
      
      setProfile(userRes.data.data.user);
      setOrders(ordersRes.data.data.orders);
      setAddresses(addressesRes.data.data.addresses);
    } catch (err) {
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleEditAddress = (address: Address) => {
    setSelectedAddress(address);
    setAddressModalOpen(true);
  };

  const handleAddAddress = () => {
    setSelectedAddress(null);
    setAddressModalOpen(true);
  };

  const handleAddressSuccess = () => {
    loadDashboardData();
  };

  if (loading) {
    return (
      <DashboardLayout userRole="USER" user={profile || undefined}>
        <div className="flex justify-center items-center h-96">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <span className="text-lg">Loading your dashboard...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout userRole="USER" user={profile || undefined}>
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="text-red-500 text-lg mb-2">⚠️</div>
            <div className="text-red-500">{error}</div>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const orderTableColumns = [
    { key: 'id', label: 'Order #', render: (value: any) => (
      <span className="font-mono text-sm">{value}</span>
    )},
    { key: 'createdAt', label: 'Date', render: (value: any) => (
      <span className="text-sm">{new Date(value).toLocaleDateString()}</span>
    )},
    { key: 'status', label: 'Status', render: (value: any) => (
      <Badge variant={
        value === 'COMPLETED' ? 'default' : 
        value === 'PENDING' ? 'secondary' : 
        value === 'CANCELLED' ? 'destructive' : 'outline'
      }>
        {value}
      </Badge>
    )},
    { key: 'total', label: 'Total', render: (value: any) => (
      <span className="font-semibold text-indigo-700">Rs.{value?.toLocaleString()}</span>
    )},
    { key: 'actions', label: '', render: (value: any, row: Order) => (
      <Button size="sm" variant="outline" onClick={() => navigate(`/orders/${row.id}`)}>
        <Eye className="w-4 h-4 mr-1" />
        View
      </Button>
    )}
  ];

  const addressTableColumns = [
    { key: 'recipientName', label: 'Name', render: (value: any) => (
      <span className="font-semibold">{value}</span>
    )},
    { key: 'address', label: 'Address', render: (value: any, row: Address) => (
      <div>
        <div className="text-sm">{row.street}, {row.city}, {row.state}, {row.country} {row.postalCode}</div>
        <div className="text-xs text-muted-foreground">Phone: {row.phone}</div>
      </div>
    )},
    { key: 'isDefault', label: 'Type', render: (value: any) => (
      <Badge variant={value ? 'default' : 'secondary'}>
        {value ? 'Default' : 'Additional'}
      </Badge>
    )},
    { key: 'actions', label: '', render: (value: any, row: Address) => (
      <Button size="sm" variant="outline" onClick={() => handleEditAddress(row)}>
        <Edit className="w-4 h-4 mr-1" />
        Edit
      </Button>
    )}
  ];

  const totalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const recentOrders = orders.slice(0, 5);
  const defaultAddress = addresses.find(addr => addr.isDefault);

  return (
    <DashboardLayout userRole="USER" user={profile || undefined}>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Welcome back, {profile?.firstName}!
          </h1>
          <p className="text-xl text-muted-foreground">
            Here's what's happening with your account today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <DashboardCard
            title="Total Orders"
            value={orders.length}
            description="Orders placed"
            icon="📋"
          />
          <DashboardCard
            title="Total Spent"
            value={`Rs.${totalSpent.toLocaleString()}`}
            description="Total amount spent"
            icon="💰"
          />
          <DashboardCard
            title="Saved Addresses"
            value={addresses.length}
            description="Delivery addresses"
            icon="📍"
          />
        </div>

        {/* Profile Section */}
        <Card className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="w-5 h-5" />
              Profile Information
            </CardTitle>
            <CardDescription>
              Your personal information and account details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Avatar and Basic Info */}
              <div className="flex items-start gap-4">
                <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                  <AvatarImage src={profile?.avatar} />
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                    {profile?.firstName?.[0]}{profile?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {profile?.firstName} {profile?.lastName}
                  </h2>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {profile?.email}
                    </div>
                    {profile?.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {profile?.phone}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <Badge variant="secondary">Customer</Badge>
                    <Badge variant="outline">Active</Badge>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-col gap-3 lg:ml-auto">
                <Button 
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  onClick={() => setEditProfileOpen(true)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setChangePasswordOpen(true)}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Default Address */}
        {defaultAddress && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Default Delivery Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold">{defaultAddress.recipientName}</h3>
                    <p className="text-sm text-gray-600">
                      {defaultAddress.street}, {defaultAddress.city}, {defaultAddress.state}, {defaultAddress.country} {defaultAddress.postalCode}
                    </p>
                    <p className="text-sm text-gray-500">Phone: {defaultAddress.phone}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEditAddress(defaultAddress)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tables */}
        <div className="grid gap-6 lg:grid-cols-2">
          <DashboardTable
            title="Recent Orders"
            data={recentOrders}
            columns={orderTableColumns}
            emptyMessage="No orders found"
            actionButton={
              <Button variant="outline" size="sm" onClick={() => navigate('/orders')}>
                <Eye className="w-4 h-4 mr-1" />
                View All
              </Button>
            }
          />
          <DashboardTable
            title="My Addresses"
            data={addresses}
            columns={addressTableColumns}
            emptyMessage="No addresses found"
            actionButton={
              <Button variant="outline" size="sm" onClick={handleAddAddress}>
                <Plus className="w-4 h-4 mr-1" />
                Add New
              </Button>
            }
          />
        </div>

        {/* Quick Actions Grid */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Manage your account and preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button 
                variant="outline" 
                className="h-24 flex-col gap-2 hover:bg-indigo-50 hover:border-indigo-200 transition-all"
                onClick={() => setEditProfileOpen(true)}
              >
                <UserIcon className="w-6 h-6 text-indigo-600" />
                <span className="font-medium">Edit Profile</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-24 flex-col gap-2 hover:bg-purple-50 hover:border-purple-200 transition-all"
                onClick={handleAddAddress}
              >
                <MapPin className="w-6 h-6 text-purple-600" />
                <span className="font-medium">Manage Addresses</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-24 flex-col gap-2 hover:bg-pink-50 hover:border-pink-200 transition-all"
                onClick={() => setChangePasswordOpen(true)}
              >
                <Lock className="w-6 h-6 text-pink-600" />
                <span className="font-medium">Change Password</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-24 flex-col gap-2 hover:bg-green-50 hover:border-green-200 transition-all"
                onClick={() => navigate('/orders')}
              >
                <ShoppingBag className="w-6 h-6 text-green-600" />
                <span className="font-medium">View Orders</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <EditProfileModal
        isOpen={editProfileOpen}
        onClose={() => setEditProfileOpen(false)}
        user={profile!}
        onUpdate={setProfile}
      />
      
      <ChangePasswordModal
        isOpen={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
      />
      
      <AddressModal
        isOpen={addressModalOpen}
        onClose={() => setAddressModalOpen(false)}
        address={selectedAddress}
        onSuccess={handleAddressSuccess}
      />
    </DashboardLayout>
  );
};

export default DashboardPage; 