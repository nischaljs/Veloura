 
import { DashboardLayout, DashboardCard, DashboardTable } from './index';
import { User } from '../../types';

// Example usage of dashboard components
const ExampleDashboard: React.FC = () => {
  // Mock user data
  const mockUser: User = {
    id: 1,
    email: 'admin@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'ADMIN',
    isActive: true,
    createdAt: new Date().toISOString(),
    avatar: 'https://via.placeholder.com/40x40'
  };

  // Mock data
  const mockStats = {
    totalUsers: 1250,
    totalVendors: 45,
    pendingVendors: 8,
    totalSales: 125000
  };

  const mockUsers = [
    {
      id: 1,
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice@example.com',
      role: 'USER',
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      firstName: 'Bob',
      lastName: 'Smith',
      email: 'bob@example.com',
      role: 'VENDOR',
      isActive: true,
      createdAt: new Date().toISOString()
    }
  ];

  const userTableColumns = [
    { key: 'name', label: 'Name', render: (value: any, row: any) => (
      <div>
        <div className="font-medium">{row.firstName} {row.lastName}</div>
        <div className="text-sm text-muted-foreground">{row.email}</div>
      </div>
    )},
    { key: 'role', label: 'Role', render: (value: any) => (
      <span className="capitalize">{value}</span>
    )},
    { key: 'createdAt', label: 'Joined', render: (value: any) => (
      <span className="text-sm text-muted-foreground">
        {new Date(value).toLocaleDateString()}
      </span>
    )}
  ];

  return (
    <DashboardLayout userRole="ADMIN" user={mockUser}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Example Dashboard</h1>
          <p className="text-muted-foreground">
            This is an example of how to use the dashboard components.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            title="Total Users"
            value={mockStats.totalUsers}
            description="Active users in the system"
            icon="👥"
          />
          <DashboardCard
            title="Total Vendors"
            value={mockStats.totalVendors}
            description="Registered vendors"
            icon="🏪"
          />
          <DashboardCard
            title="Pending Vendors"
            value={mockStats.pendingVendors}
            description="Awaiting approval"
            icon="⏳"
          />
          <DashboardCard
            title="Total Sales"
            value={mockStats.totalSales}
            description="Total revenue generated"
            icon="💰"
          />
        </div>

        {/* Table Example */}
        <DashboardTable
          title="Recent Users"
          data={mockUsers}
          columns={userTableColumns}
          emptyMessage="No users found"
        />
      </div>
    </DashboardLayout>
  );
};

export default ExampleDashboard; 