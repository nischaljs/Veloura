# Dashboard Components

This directory contains reusable dashboard components that provide a consistent layout and functionality for different user roles (Admin, Vendor, User) in the Veloura e-commerce platform.

## Components

### DashboardLayout
The main layout component that provides:
- Responsive sidebar navigation
- Role-based navigation items
- User profile dropdown
- Consistent header and footer

**Props:**
- `children`: React nodes to render in the main content area
- `userRole`: User role ('ADMIN', 'VENDOR', 'USER')
- `user`: User object with profile information
- `navigationItems`: Optional custom navigation items

**Usage:**
```tsx
<DashboardLayout userRole="ADMIN" user={user}>
  <div>Dashboard content here</div>
</DashboardLayout>
```

### DashboardCard
A reusable card component for displaying statistics and metrics.

**Props:**
- `title`: Card title
- `value`: Value to display (string or number)
- `description`: Optional description text
- `icon`: Optional icon (emoji or icon component)
- `trend`: Optional trend data with value and direction
- `className`: Optional CSS classes

**Usage:**
```tsx
<DashboardCard
  title="Total Sales"
  value={15000}
  description="Revenue this month"
  icon="💰"
  trend={{ value: 12, isPositive: true }}
/>
```

### DashboardTable
A reusable table component for displaying data in a tabular format.

**Props:**
- `title`: Table title
- `data`: Array of data objects
- `columns`: Column configuration array
- `loading`: Loading state
- `emptyMessage`: Message to show when no data
- `className`: Optional CSS classes

**Usage:**
```tsx
<DashboardTable
  title="Recent Orders"
  data={orders}
  columns={[
    { key: 'id', label: 'Order #' },
    { key: 'status', label: 'Status', render: (value) => <Badge>{value}</Badge> }
  ]}
  loading={loading}
  emptyMessage="No orders found"
/>
```

## Dashboard Pages

### AdminDashboardPage
Dashboard for admin users showing:
- System-wide statistics
- Recent users and vendors
- Quick action buttons
- User and vendor management tables

### VendorDashboardPage
Dashboard for vendor users showing:
- Business profile information
- Sales and order statistics
- Product management
- Analytics overview

### DashboardPage (User)
Dashboard for regular users showing:
- Personal profile information
- Order history
- Address management
- Account statistics

## Navigation Structure

### Admin Navigation
- Dashboard
- Users
- Vendors
- Products
- Orders
- Categories
- Brands
- Coupons
- Analytics
- Settings
- Activity Logs
- Backup

### Vendor Navigation
- Dashboard
- Products
- Orders
- Analytics
- Reviews
- Profile
- Bank Details
- Policies

### User Navigation
- Dashboard
- Profile
- Addresses
- Orders
- Wishlist

## API Integration

The dashboard components integrate with the following backend services:

### Admin Services (`/admin`)
- User management
- Vendor management
- Product management
- Analytics
- System settings

### Vendor Services (`/vendors`)
- Profile management
- Product management
- Order management
- Analytics
- Bank details
- Policies

### User Services (`/users`)
- Profile management
- Address management
- Order history

## Styling

All components use:
- Tailwind CSS for styling
- shadcn/ui components for consistency
- Responsive design patterns
- Consistent color scheme (indigo/pink gradient)

## Responsive Behavior

- Sidebar collapses on mobile devices
- Tables become scrollable on small screens
- Cards stack vertically on mobile
- Navigation adapts to screen size

## Future Enhancements

- Add more chart components for analytics
- Implement real-time notifications
- Add export functionality for data
- Enhance mobile navigation
- Add dark mode support 