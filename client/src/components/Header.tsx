import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Github, Twitter, Instagram, Globe } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { fetchCategories } from '@/services/category';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { useCart } from '../context/CartContext';

const navLinks = [
  { name: 'Home', to: '/' },
  { name: 'About', to: '/about' },
  { name: 'Contact', to: '/contact' },
  { name: 'FAQ', to: '/faq' },
];

// Add interfaces for Category
interface Category {
  slug: string;
  name: string;
  image?: string;
}

export default function Header() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [catLoading, setCatLoading] = useState(true);
  const [catError, setCatError] = useState('');
  const [search, setSearch] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { cartCount } = useCart();

  useEffect(() => {
    fetchCategories(100)
      .then(data => setCategories(data.data?.categories || []))
      .catch(() => setCatError('Failed to load categories'))
      .finally(() => setCatLoading(false));
  }, []);

  return (
    <>
      {/* Top promotional bar */}
      <div className="w-full bg-gradient-to-r from-pink-500 to-indigo-500 text-white text-sm py-2 px-4 flex items-center justify-between font-semibold relative">
        {/* Social media links (left) */}
        <div className="flex items-center gap-3 z-10">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:bg-white/20 rounded-full p-1 transition-colors duration-200 flex items-center">
            <Globe className="w-4 h-4 text-white drop-shadow" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:bg-white/20 rounded-full p-1 transition-colors duration-200 flex items-center">
            <Instagram className="w-4 h-4 text-white drop-shadow" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:bg-white/20 rounded-full p-1 transition-colors duration-200 flex items-center">
            <Twitter className="w-4 h-4 text-white drop-shadow" />
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:bg-white/20 rounded-full p-1 transition-colors duration-200 flex items-center">
            <Github className="w-4 h-4 text-white drop-shadow" />
          </a>
        </div>
        {/* Promotional text (center) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center pointer-events-none">
          <span className="text-white text-sm font-semibold text-center pointer-events-auto">
            FREE SHIPPING THIS WEEK ORDER OVER - Rs.550
          </span>
        </div>
        {/* Become a seller (right) */}
        <div className="z-10">
          <Link to="/register" className="text-white underline hover:text-indigo-100 text-xs font-normal ml-4">Register</Link>
        </div>
      </div>
      {/* Main header */}
      <header className="w-full bg-white/95 shadow-lg sticky top-0 z-50 border-b border-zinc-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 gap-4">
          {/* Logo/Brand */}
          <Link to="/" className="text-2xl font-extrabold tracking-tight text-indigo-600 flex items-center gap-2">
            <span className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white px-2 py-1 rounded-lg">V</span>
            <span>Veloura</span>
          </Link>
          {/* Nav links */}
          <nav className="hidden lg:flex gap-6 ml-8 items-center">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} className="text-base font-medium text-gray-700 hover:text-indigo-600 transition-colors">
                {link.name}
              </Link>
            ))}
          </nav>
          {/* Search bar */}
          <form className="flex-1 max-w-md mx-6 hidden md:flex" onSubmit={e => { e.preventDefault(); if (search.trim()) navigate(`/products?q=${encodeURIComponent(search)}`); }}>
            <div className="relative w-full">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search products, categories..."
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
              <Search className="absolute left-2 top-2.5 w-4 h-4 text-zinc-400" />
            </div>
          </form>
          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative p-2 rounded-full hover:bg-indigo-50 transition-colors">
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              {/* Cart badge dynamic */}
              <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full px-1">{cartCount}</span>
            </Link>
            {!user ? (
              <>
                <Link to="/login">
                  <Button variant="outline" className="border-indigo-600 text-indigo-700 hover:bg-indigo-50 mr-2">Login</Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-pink-600 text-white hover:bg-pink-700">Register</Button>
                </Link>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger className="p-0 border-0 bg-transparent focus:outline-none">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="https://via.placeholder.com/40x40.png?text=User" alt="User" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Account</DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link to={user?.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'}>
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/account">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders">Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={async () => {
                      await logout();
                      navigate('/login');
                    }}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </header>
    </>
  );
}