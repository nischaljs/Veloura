
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: 'CUSTOMER' | 'VENDOR' | 'ADMIN';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export interface Vendor {
  id: number;
  userId: number;
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  slug: string;
  taxId?: string;
  description?: string;
  logo?: string;
  banner?: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  isApproved: boolean;
  approvedAt?: string;
  rating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
  user?: User; // Populated by some endpoints
}

export interface Order {
  id: number;
  orderNumber: string;
  userId: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  subtotal: string;
  shippingFee: string;
  total: string;
  shippingAddress: any;
  customerNote?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  user: User; // Populated for admin/vendor views
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: string;
  salePrice?: string;
  productSnapshot: any;
  createdAt: string;
  updatedAt: string;
  vendorId: number;
  product?: any; // Populated for vendor order detail
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: number;
  isFeatured: boolean;
  featuredOrder?: number;
  createdAt: string;
  updatedAt: string;
}
