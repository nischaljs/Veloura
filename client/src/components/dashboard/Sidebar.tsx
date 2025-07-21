import { NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Package, Users, ShoppingBag, DollarSign, Home, User, ListOrdered, Settings } from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();

  const getNavLinks = () => {
    if (!user) return [];

    switch (user.role) {
      case 'ADMIN':
        return [
          { name: 'Dashboard', path: '/admin/dashboard', icon: <Home className="h-5 w-5" /> },
          { name: 'Users', path: '/admin/users', icon: <Users className="h-5 w-5" /> },
          { name: 'Vendors', path: '/admin/vendors', icon: <ShoppingBag className="h-5 w-5" /> },
          { name: 'Products', path: '/admin/products', icon: <Package className="h-5 w-5" /> },
          { name: 'Orders', path: '/admin/orders', icon: <ListOrdered className="h-5 w-5" /> },
          { name: 'Categories', path: '/admin/categories', icon: <Settings className="h-5 w-5" /> },
          { name: 'Payouts', path: '/admin/payouts', icon: <DollarSign className="h-5 w-5" /> },
        ];
      case 'VENDOR':
        return [
          { name: 'Dashboard', path: '/vendor/dashboard', icon: <Home className="h-5 w-5" /> },
          { name: 'Products', path: '/vendor/products', icon: <Package className="h-5 w-5" /> },
          { name: 'Orders', path: '/vendor/orders', icon: <ListOrdered className="h-5 w-5" /> },
          { name: 'Payouts', path: '/vendor/payouts', icon: <DollarSign className="h-5 w-5" /> },
          { name: 'Profile', path: '/vendor/profile', icon: <User className="h-5 w-5" /> },
        ];
      case 'CUSTOMER':
        return [
          { name: 'Dashboard', path: '/dashboard', icon: <Home className="h-5 w-5" /> },
          { name: 'Orders', path: '/orders', icon: <ListOrdered className="h-5 w-5" /> },
          { name: 'Profile', path: '/profile', icon: <User className="h-5 w-5" /> },
        ];
      default:
        return [];
    }
  };

  return (
    <aside className="w-64 bg-white shadow-lg p-4 flex flex-col">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-indigo-600">Veloura</h2>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          {getNavLinks().map((link) => (
            <li key={link.name}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 
                  ${isActive ? 'bg-indigo-500 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'}`
                }
              >
                {link.icon}
                <span className="font-medium">{link.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
