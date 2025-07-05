// Dashboard Types
export interface DashboardStats {
  totalSales?: number;
  totalOrders?: number;
  averageOrderValue?: number;
  totalProducts?: number;
  activeProducts?: number;
  totalReviews?: number;
  averageRating?: number;
  totalUsers?: number;
  totalVendors?: number;
  pendingVendors?: number;
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: 'USER' | 'VENDOR' | 'ADMIN';
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  orderCount?: number;
  totalSpent?: number;
}

export interface Vendor {
  id: number;
  userId: number;
  businessName: string;
  businessEmail: string;
  businessPhone?: string;
  slug: string;
  description?: string;
  logo?: string;
  banner?: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  isApproved: boolean;
  isSuspended: boolean;
  createdAt: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  products?: Product[];
  bankDetails?: BankDetail[];
  policies?: VendorPolicy[];
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  comparePrice?: number;
  images: string[];
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
  vendorId: number;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
}

export interface BankDetail {
  id: number;
  vendorId: number;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  ifscCode?: string;
  branchName?: string;
}

export interface VendorPolicy {
  id: number;
  vendorId: number;
  type: 'RETURN' | 'SHIPPING' | 'WARRANTY' | 'CUSTOM';
  title: string;
  description: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  vendorId: number;
  quantity: number;
  price: number;
  product?: Product;
}

export interface Address {
  id: number;
  userId: number;
  recipientName: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone: string;
  isDefault: boolean;
}

export interface DashboardNavigationItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
  children?: DashboardNavigationItem[];
}

export interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole: 'USER' | 'VENDOR' | 'ADMIN';
  user?: User;
  navigationItems?: DashboardNavigationItem[];
}

export interface DashboardCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export interface DashboardTableProps {
  title: string;
  data: any[];
  columns: {
    key: string;
    label: string;
    render?: (value: any, row: any) => React.ReactNode;
  }[];
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
} 