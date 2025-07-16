import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import type { DashboardLayoutProps, DashboardNavigationItem } from '../../types';

// Icons (using simple text icons for now, can be replaced with actual icon library)
const IconMap: Record<string, string> = {
  dashboard: '📊',
  users: '👥',
  vendors: '🏪',
  products: '📦',
  orders: '📋',
  analytics: '📈',
  settings: '⚙️',
  profile: '👤',
  addresses: '📍',
  bankDetails: '🏦',
  reviews: '⭐',
  categories: '🏷️',
  coupons: '🎫',
  notifications: '🔔',
  backup: '💾',
  activity: '📝',
  logout: '🚪'
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  userRole, 
  user, 
  navigationItems = [] 
}) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Default navigation items based on role
  const getDefaultNavigation = (): DashboardNavigationItem[] => {
    switch (userRole) {
      case 'ADMIN':
        return [
          { label: 'Dashboard', href: '/admin/dashboard', icon: 'dashboard' },
          { label: 'Users', href: '/admin/users', icon: 'users' },
          { label: 'Vendors', href: '/admin/vendors', icon: 'vendors' },
          { label: 'Products', href: '/admin/products', icon: 'products' },
          { label: 'Orders', href: '/admin/orders', icon: 'orders' },
          { label: 'Categories', href: '/admin/categories', icon: 'categories' },
          { label: 'Coupons', href: '/admin/coupons', icon: 'coupons' },
          { label: 'Analytics', href: '/admin/analytics', icon: 'analytics' },
          { label: 'Settings', href: '/admin/settings', icon: 'settings' },
          
        ];
      case 'VENDOR':
        return [
          { label: 'Dashboard', href: '/vendor/dashboard', icon: 'dashboard' },
          { label: 'Products', href: '/vendor/products', icon: 'products' },
          { label: 'Orders', href: '/vendor/orders', icon: 'orders' },
          { label: 'Analytics', href: '/vendor/analytics', icon: 'analytics' },
          { label: 'Reviews', href: '/vendor/reviews', icon: 'reviews' },
          { label: 'Profile', href: '/vendor/profile', icon: 'profile' },
          { label: 'Bank Details', href: '/vendor/bank-details', icon: 'bankDetails' },
        ];
      case 'USER':
      default:
        return [
          { label: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
          { label: 'Profile', href: '/account', icon: 'profile' },
          { label: 'Addresses', href: '/account#addresses', icon: 'addresses' },
          { label: 'Orders', href: '/orders', icon: 'orders' },
          { label: 'Wishlist', href: '/wishlist', icon: 'products' }
        ];
    }
  };

  const navItems = navigationItems.length > 0 ? navigationItems : getDefaultNavigation();

  return (
    <div className="flex max-h-screen">
      {/* Sidebar - Always Full Height, Scrollable if Needed */}
      <div className={`bg-white border-r border-gray-200 shadow-sm transition-all duration-300 flex-shrink-0 flex flex-col ${isCollapsed ? 'w-16' : 'w-64'} min-h-screen`}>
        {/* Sidebar Header */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center gap-2">
            {isCollapsed ? (
              <div className="text-xl font-bold text-indigo-600">V</div>
            ) : (
              <>
                <div className="text-2xl font-bold text-indigo-600">Veloura</div>
                <Badge variant="secondary">{userRole}</Badge>
              </>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 flex-grow overflow-y-auto">
          <div className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === item.href
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <span className="text-lg flex-shrink-0">{IconMap[item.icon] || '📄'}</span>
                {!isCollapsed && (
                  <>
                    <span className="font-medium truncate">{item.label}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto flex-shrink-0">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Link>
            ))}
          </div>
        </nav>

        {/* Sidebar Footer - Directly after nav */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Toggle Button - Directly after footer */}
        <div className="p-4 border-t border-gray-200">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? '→' : '←'}
          </Button>
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 min-h-screen flex flex-col overflow-auto">
        <div className="p-6 bg-gray-50 flex-1 flex flex-col">
          <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
